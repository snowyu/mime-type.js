import picomatch from 'picomatch/posix'
import { defineProperty, isArray, isString, isFunction } from 'util-ex'
import path from 'path.js'

function isMatch(str, pattern, options) {
  return picomatch(pattern, options)(str)
}

const extractTypeRegExp = /^\s*([^;\s]*)(?:;|\s|$)/
const textTypeRegExp = /^text\//i
const indexOf = Array.prototype.indexOf

const refSources = ['nginx', 'apache', undefined, 'iana']
const shouldDebug = typeof process === 'object' && process && process.env && process.env.DEBUG_MIME

MimeType.dupDefault = MimeType.prototype.dupDefault = 0;
MimeType.dupSkip = MimeType.prototype.dupSkip = 1;
MimeType.dupOverwrite = MimeType.prototype.dupOverwrite = 2;
MimeType.dupAppend = MimeType.prototype.dupAppend = 3;

/**
 * Constructs a MimeType object to manage MIME types and their associated extensions.
 * @param {Object} db - An initial database containing MIME type mappings.
 * @param {number} [duplicationProcessWay] - A flag specifying how to handle duplicate MIME type entries.
 *     If provided, it should be one of:
 *       - `dupDefault: 0`: Default strategy that resolves duplicates based on source priority.
 *         See the description for details on this strategy.
 *       - `dupSkip: 1`: Skip adding the new MIME type if a duplicate entry already exists.
 *       - `dupOverwrite: 2`: Replace the existing MIME type with the new one if a duplicate is found.
 *       - `dupAppend: 3`: Add the new MIME type to the end of the existing ones if a duplicate is encountered.
 *     If not specified, it defaults to the `dupDefault` strategy,
 *     The `dupDefault` strategy works as follows:
 *       - If the existing MIME type is 'application/octet-stream', it's not overwritten.
 *       - If sources are equal and the existing type starts with 'application/', it's preserved.
 *       - Otherwise, if the new source is considered more authoritative (earlier in the `refSources` array),
 *         the new type overwrites the old one. The `refSources` array may include server configurations
 *         and standards bodies, such as ['nginx', 'apache', undefined, 'iana'], with `undefined` representing
 *         an unspecified or less authoritative source.
 */
export function MimeType(db, duplicationProcessWay) {
  if (!(this instanceof MimeType)) {
    return new MimeType(db, duplicationProcessWay);
  }
  defineProperty(this, 'types', {});
  defineProperty(this, 'dup', this.dupDefault);
  defineProperty(this, 'extensions', undefined, {
    get: function() {
      var j, k, len, mime, ref, result;
      result = {};
      ref = Object.keys(this);
      for (j = 0, len = ref.length; j < len; j++) {
        k = ref[j];
        mime = this[k];
        result[k] = mime.extensions;
      }
      return result;
    }
  });
  if (duplicationProcessWay && indexOf.call([0, 1, 2, 3], duplicationProcessWay) >= 0) {
    this.dup = duplicationProcessWay;
  }
  if (db) {
    this.load(db);
  }
}


/*
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */
MimeType.prototype.charset = function(type) {
  let result;
  if (type && isString(type)) {
    try {
      const match = extractTypeRegExp.exec(type)
      const mime = match && this[match[1].toLowerCase()]
      if (mime && mime.charset) {
        result = mime.charset
      }
      // default text/* to utf-8
      if (!result && match && textTypeRegExp.test(match[1])) {
        result = 'utf-8'
      }
    } catch (error) {}
  }
  return result;
};


/*
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */
MimeType.prototype.contentType = function(str) {
  var charset;
  var charset, mime;
  if (str && isString(str)) {
    mime = str.indexOf('/') === -1 ? this.lookup(str) : str;
    if (mime) {
      if (mime.indexOf('charset') === -1) {
        charset = this.charset(mime);
        if (charset) {
          mime += '; charset=' + charset.toLowerCase();
        }
      }
    }
  }
  return mime;
};


/*
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */
MimeType.prototype.extension = function(type) {
  var result;
  if (type && isString(type)) {
    result = extractTypeRegExp.exec(type);
    result = result && this[result[1].toLowerCase()];
    if (result) {
      result = result.defaultExtension || result.extensions[0];
    }
  }
  return result;
};


/*
 * Lookup the MIME types for a file path/extension.
 *
 * @param {string} path
 * @return {undefined|string|array}
 */
MimeType.prototype.lookup = function(aPath) {
  var extension, result;
  if (aPath && isString(aPath)) {
    // get the extension ("ext" or ".ext" or full path)
    extension = path.extname('x.' + aPath).toLowerCase().slice(1);
    if (extension) {
      if (/[*?!+|{]/.test(extension)) {
        result = Object.keys(this.types).filter((name) => isMatch(name, extension))
        result = result.length ? (result.map((ext) => this.types[ext])) : undefined
      } else {
        result = this.types[extension];
      }
    }
  }
  return result;
};


/*
 * Return all MIME types which matching a pattern
 *   [spec](http://tools.ietf.org/html/rfc2616#section-14.1)
 * @param {string} pattern the mime type pattern, For example "video/*", "audio/*", ..
 * @return {array}
 */
MimeType.prototype.glob = function(pattern) {
  var result;
  if (pattern === '*/*') {
    return ['application/octet-stream'];
  }
  result = Object.keys(this).filter(function(name) {
    return isMatch(name, pattern);
  });
  return result;
};


/*
 * Whether the mime type is exist.
 * @param {string} type the mime type
 * @return {boolean}
 */
MimeType.prototype.exist = Object.prototype.hasOwnProperty;


/*
 * Add a custom mime/extension mapping and handles potential conflicts.
 * @param (string) type:  mime type
 * @param (object) mime:  mime object
 *  * "source": "iana",
 *  * "charset": "UTF-8",
 *  * "compressible": true,
 *  * "extensions": ["js"]
 * @param {number} [dup=this.dup] - The conflict resolution strategy. Can be one of:
 *   - `this.dupSkip`: Skip the existing mapping.
 *   - `this.dupAppend`: Append the new type to the existing mapping.
 *   - `this.dupOverwrite`: Overwrite the existing mapping.
 *   - `this.dupDefault`: Uses a default strategy where:
 *       - If the existing MIME type is 'application/octet-stream', it is not overwritten.
 *       - If sources are equal and the existing type starts with 'application/', it is retained.
 *       - Otherwise, if the new source is considered more authoritative (appears earlier in `refSources`),
 *         the new type will overwrite the old one. The `refSources` array includes server configurations
 *         and standards bodies, e.g., ['nginx', 'apache', undefined, 'iana'], with `undefined` marking
 *         an unspecified or less authoritative source.
 * @return {array<string>}: the added extensions
 */
MimeType.prototype.define = function(type, mime, dup) {
  var extension, exts, from, j, len, ref, t, to;
  if (!(type && mime && mime.extensions && !this.hasOwnProperty(type))) {
    return;
  }
  if (dup == null) {
    dup = this.dup;
  }
  exts = mime.extensions;
  if (!isArray(exts)) {
    mime.extensions = [exts];
  }
  exts = [];
  if (mime.charset) {
    mime.charset = mime.charset.toLowerCase();
  }
  ref = mime.extensions;
  for (j = 0, len = ref.length; j < len; j++) {
    extension = ref[j];
    t = this.types[extension];
    if (t) {
      switch (dup) {
        case this.dupSkip:
          continue;
        case this.dupAppend:
          if (isString(t)) {
            t = [t];
          }
          if (indexOf.call(t, type) < 0) {
            t.push(type);
          }
          break;
        case this.dupOverwrite:
          t = type;
          break;
        case this.dupDefault:
          if (isArray(t)) {
            t = t[0];
          }
          from = refSources.indexOf(this[t].source);
          to = refSources.indexOf(mime.source);
          if (t !== 'application/octet-stream' && from > to || from === to && t.substr(0, 12) === 'application/') {
            if (shouldDebug) {
              console.warn("defineMime(" + type + "): the " + extension + " extension is exists on\n" + t + " skipped it.");
            }
            continue;
          } else {
            t = type;
          }
      }
    } else {
      t = type;
    }
    this.types[extension] = t;
    exts.push(extension);
  }
  if (exts.length) {
    mime.extensions = exts;
    this[type] = mime;
  }
  return exts;
};


/*
 * load mime-types from db.
 */
MimeType.prototype.load = function(mimes, duplicationProcessWay) {
  var result;
  result = 0;
  Object.keys(mimes).forEach((function(_this) {
    return function(type) {
      var t;
      t = _this.define(type, mimes[type], duplicationProcessWay);
      if (t && t.length) {
        return result++;
      }
    };
  })(this));
  return result;
};


/*
 * remove the specified mime-type.
 */
MimeType.prototype.delete = function(type) {
  var i, k, ref, result, v;
  result = this.exist(type);
  if (result) {
    ref = this.types;
    for (k in ref) {
      v = ref[k];
      if (isArray(v)) {
        i = v.indexOf(type);
        if (i !== -1) {
          v.splice(i, 1);
          if (v.length === 1) {
            this.types[k] = v[0];
          }
        }
      } else if (type === v) {
        delete this.types[k];
      }
    }
    delete this[type];
  }
  return result;
};


/*
 * clear the mime-types.
 */
MimeType.prototype.clear = function(filter) {
  var k, ref, result, v;
  result = 0;
  ref = this;
  for (k in ref) {
    v = ref[k];
    if (this.hasOwnProperty(k)) {
      if (isFunction(filter)) {
        if (filter(k, v)) {
          this["delete"](k);
          result++;
        }
      } else if (isString(filter)) {
        if (isMatch(k, filter)) {
          this["delete"](k);
          result++;
        }
      } else {
        this["delete"](k);
        result++;
      }
    }
  }
  return result;
};

export default MimeType;
