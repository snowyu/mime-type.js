export enum DuplicationProcessWay {
  dupDefault = 0,
  dupSkip,
  dupOverwrite,
  dupAppend,
}

export interface IMimeType {
  source: string;
  charset?: string;
  compressible?: boolean;
  extensions: string[]|string;
}

export interface IMimeTypes {
  [type: string]: IMimeType;
}

export type FilterFunctionType = (type: string, mime: IMimeType) => number;

export class MimeType {
  static readonly dupDefault: DuplicationProcessWay.dupDefault;
  static readonly dupSkip: DuplicationProcessWay.dupSkip;
  static readonly dupOverwrite: DuplicationProcessWay.dupOverwrite;
  static readonly dupAppend: DuplicationProcessWay.dupAppend;

  /**
   * Uses a default strategy where:
   *   - If the existing MIME type is 'application/octet-stream', it is not overwritten.
   *   - If sources are equal and the existing type starts with 'application/', it is retained.
   *   - Otherwise, if the new source is considered more authoritative (appears earlier in `refSources`),
   *     the new type will overwrite the old one. The `refSources` array includes server configurations
   *     and standards bodies, e.g., ['nginx', 'apache', undefined, 'iana'], with `undefined` marking
   *     an unspecified or less authoritative source.
   */
  dupDefault: 0;
  /**
   * Skip the existing mapping.
   */
  dupSkip: 1;
  /**
   * Overwrite the existing mapping.
   */
  dupOverwrite: 2;
  /**
   * Append the extension to the existing mapping.
   */
  dupAppend: 3;

  /**
   * A map of types by extension.
   */
  types: {[extension: string]: string};
  /**
   * the default duplication process way
   */
  dup: DuplicationProcessWay;
  /**
   * A map of extensions by content-type.
   */
  readonly extensions: {[mimetype: string]: string};
  [mimetype: string]: string|number|object|IMimeType;


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
  constructor (db: IMimeTypes, duplicationProcessWay: DuplicationProcessWay);
  /**
   * Get the default charset for a MIME type.
   * @param type a MIME type
   */
  charset(type: string): string|boolean;
  /**
   * Create a full Content-Type header given a MIME type or extension.
   * @param str a MIME type or extension
   */
  contentType(str: string): boolean|string;
  /**
   * Get the default extension for a MIME type.
   * @param type a MIME type
   */
  extension(type: string): boolean|string;
  /**
   * Lookup the MIME types for a file path/extension.
   * @param aPath a file path/extension.
   */
  lookup(aPath: string): undefined|string|string[];
  /**
   * Return all MIME types which matching a pattern
   *    [spec](http://tools.ietf.org/html/rfc2616#section-14.1)
   * @param pattern the mime type pattern, For example "video/*", "audio/*", ..
   */
  glob(pattern: string): string[];
  /**
   * Whether the mime type is exist.
   * @param type the mime type
   */
  exist(type: string): boolean;
  /**
   * Add a custom mime/extension mapping
   * @param type mime type
   * @param mime mime object
   *  * "source": "iana",
   *  * "charset": "UTF-8",
   *  * "compressible": true,
   *  * "extensions": ["js"]
   * @param {number} [dup=this.dup] - The optional conflict resolution strategy, defaults to the this.dup. Can be one of:
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
   *
   * @returns the added extensions
   */
  define(type: string, mime: IMimeType, dup?: DuplicationProcessWay): string[];
  /**
   * load mime-types from db.
   * @param mimes the mimes to add
   * @param duplicationProcessWay optional duplication process way, defaults to the this.dup.
   * @returns the count of added items.
   */
  load(mimes: IMimeTypes, duplicationProcessWay?: DuplicationProcessWay): number;
  /**
   * remove the specified mime-type.
   * @param type the mime type.
   * @returns return true if removed successful.
   */
  delete(type: string): boolean;
  /**
   * clear the mime-types.
   * @param filter optional glob or function to remove items. defaults to clear all.
   * @returns the removed items count.
   */
  clear(filter?: string|FilterFunctionType): number;
}

export default MimeType