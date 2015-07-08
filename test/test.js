
var assert = require('assert')
var mimeType = require('../with-db')
var db = require('mime-db')

describe('mimeType', function () {
  describe('.clear(filter)', function () {
    it('should clear all types', function () {
      mimeType.clear()
      assert.equal(Object.keys(mimeType).length, 0)
      assert.equal(Object.keys(mimeType.types).length, 0)
      mimeType.load(db)
    })
    it('should clear specifiled types via filter function', function () {
      var count = Object.keys(mimeType).length
      var result = mimeType.clear(function(type){
        return (type.substr(0, 4) === 'text')
      })
      assert.ok(result > 0)
      assert.equal(Object.keys(mimeType).length+result, count)
      mimeType.clear()
      mimeType.load(db)
    })
    it('should clear specifiled types via filter string', function () {
      var count = Object.keys(mimeType).length
      var result = mimeType.clear('text/*')
      assert.ok(result > 0)
      assert.equal(Object.keys(mimeType).length+result, count)
      mimeType.clear()
      mimeType.load(db)
    })
  })
  describe('.delete(type)', function () {
    it('should delete a mime type', function () {
      assert.ok(mimeType.define('1sas/ss', {extensions:['ss']}))
      assert.ok(mimeType.delete('1sas/ss'))
      assert.ok(!mimeType.hasOwnProperty('1sas/ss'))
      assert.ok(!mimeType.types.hasOwnProperty('ss'))
    })
  })
  describe('.define(type, object)', function () {
    it('should define a mime type', function () {
      assert.equal(mimeType.exist('1sas/ss'), false)
      assert.ok(mimeType.define('1sas/ss', {extensions:['ss']}))
      assert.equal(mimeType.exist('1sas/ss'), true)
    })
    it('should define a mime type and append duplication extension to the new type', function () {
      assert.equal(mimeType.exist('1das/ss'), false)
      assert.ok(mimeType.define('1das/ss', {extensions:['ss']}, mimeType.dupAppend))
      assert.equal(mimeType.exist('1das/ss'), true)
      assert.deepEqual(mimeType.types['ss'], ['1sas/ss', '1das/ss'])
    })
    it('should define a mime type and default duplcation process to the new type', function () {
      assert.equal(mimeType.exist('3das/ss'), false)
      assert.ok(mimeType.define('3das/ss', {extensions:['ss']}, mimeType.dd))
      assert.equal(mimeType.exist('3das/ss'), true)
      assert.deepEqual(mimeType.types['ss'], '3das/ss')
    })
    it('should define a mime type and overwrite duplication extension to the new type', function () {
      assert.equal(mimeType.exist('2das/ss'), false)
      assert.ok(mimeType.define('2das/ss', {extensions:['ss']}, mimeType.dupOverwrite))
      assert.equal(mimeType.exist('2das/ss'), true)
      assert.deepEqual(mimeType.types['ss'], '2das/ss')
    })
  })
  describe('.exist(type)', function () {
    it('should Test a mime type whether is exist', function () {
      assert.equal(mimeType.exist('asas/ss'), false)
      assert.equal(mimeType.exist('text/x-markdown'), true)
    })
  })
  describe('.glob(pattern)', function () {
    it('should Test glob searching', function () {
      assert.deepEqual(['application/octet-stream'], mimeType.glob('*/*'));
      assert.notEqual(mimeType.glob('application/*').indexOf('application/json'), -1);
      assert.equal(mimeType.glob('application/*').length > 1, true);
      assert.deepEqual([], mimeType.glob('qwerty/*'));
      assert.deepEqual([], mimeType.glob('qwerty/qwerty'));
      assert.deepEqual([], mimeType.glob('*/markdown'));
      assert.deepEqual(['text/x-markdown'], mimeType.glob('*/x-markdown'));
    })
  })
  describe('.charset(type)', function () {
    it('should return "utf-8" for "application/json"', function () {
      assert.equal(mimeType.charset('application/json'), 'utf-8')
    })

    it('should return "utf-8" for "application/json; foo=bar"', function () {
      assert.equal(mimeType.charset('application/json; foo=bar'), 'utf-8')
    })

    it('should return "utf-8" for "application/javascript"', function () {
      assert.equal(mimeType.charset('application/javascript'), 'utf-8')
    })

    it('should return "utf-8" for "application/JavaScript"', function () {
      assert.equal(mimeType.charset('application/JavaScript'), 'utf-8')
    })

    it('should return "utf-8" for "text/html"', function () {
      assert.equal(mimeType.charset('text/html'), 'utf-8')
    })

    it('should return "utf-8" for "TEXT/HTML"', function () {
      assert.equal(mimeType.charset('TEXT/HTML'), 'utf-8')
    })

    it('should return "utf-8" for any text/*', function () {
      assert.equal(mimeType.charset('text/x-bogus'), 'utf-8')
    })

    it('should return undefined for unknown types', function () {
      assert.strictEqual(mimeType.charset('application/x-bogus'), undefined)
    })

    it('should return undefined for any application/octet-stream', function () {
      assert.strictEqual(mimeType.charset('application/octet-stream'), undefined)
    })

    it('should return undefined for invalid arguments', function () {
      assert.strictEqual(mimeType.charset({}), undefined)
      assert.strictEqual(mimeType.charset(null), undefined)
      assert.strictEqual(mimeType.charset(true), undefined)
      assert.strictEqual(mimeType.charset(42), undefined)
    })
  })

  describe('.contentType(extension)', function () {
    it('should return content-type for "html"', function () {
      assert.equal(mimeType.contentType('html'), 'text/html; charset=utf-8')
    })

    it('should return content-type for ".html"', function () {
      assert.equal(mimeType.contentType('.html'), 'text/html; charset=utf-8')
    })

    it('should return content-type for "jade"', function () {
      assert.equal(mimeType.contentType('jade'), 'text/jade; charset=utf-8')
    })

    it('should return content-type for "json"', function () {
      assert.equal(mimeType.contentType('json'), 'application/json; charset=utf-8')
    })

    it('should return undefined for unknown extensions', function () {
      assert.strictEqual(mimeType.contentType('bogus'), undefined)
    })

    it('should return undefined for invalid arguments', function () {
      assert.strictEqual(mimeType.contentType({}), undefined)
      assert.strictEqual(mimeType.contentType(null), undefined)
      assert.strictEqual(mimeType.contentType(true), undefined)
      assert.strictEqual(mimeType.contentType(42), undefined)
    })
  })

  describe('.contentType(type)', function () {
    it('should attach charset to "application/json"', function () {
      assert.equal(mimeType.contentType('application/json'), 'application/json; charset=utf-8')
    })

    it('should attach charset to "application/json; foo=bar"', function () {
      assert.equal(mimeType.contentType('application/json; foo=bar'), 'application/json; foo=bar; charset=utf-8')
    })

    it('should attach charset to "TEXT/HTML"', function () {
      assert.equal(mimeType.contentType('TEXT/HTML'), 'TEXT/HTML; charset=utf-8')
    })

    it('should attach charset to "text/html"', function () {
      assert.equal(mimeType.contentType('text/html'), 'text/html; charset=utf-8')
    })

    it('should not alter "text/html; charset=iso-8859-1"', function () {
      assert.equal(mimeType.contentType('text/html; charset=iso-8859-1'), 'text/html; charset=iso-8859-1')
    })

    it('should return type for unknown types', function () {
      assert.equal(mimeType.contentType('application/x-bogus'), 'application/x-bogus')
    })
  })

  describe('.extension(type)', function () {
    it('should return extension for mime type', function () {
      assert.equal(mimeType.extension('text/html'), 'html')
      assert.equal(mimeType.extension(' text/html'), 'html')
      assert.equal(mimeType.extension('text/html '), 'html')
    })

    it('should return undefined for unknown type', function () {
      assert.strictEqual(mimeType.extension('application/x-bogus'), undefined)
    })

    it('should return undefined for non-type string', function () {
      assert.strictEqual(mimeType.extension('bogus'), undefined)
    })

    it('should return undefined for non-strings', function () {
      assert.strictEqual(mimeType.extension(null), undefined)
      assert.strictEqual(mimeType.extension(undefined), undefined)
      assert.strictEqual(mimeType.extension(42), undefined)
      assert.strictEqual(mimeType.extension({}), undefined)
    })

    it('should return extension for mime type with parameters', function () {
      assert.equal(mimeType.extension('text/html;charset=utf-8'), 'html')
      assert.equal(mimeType.extension('text/HTML; charset=utf-8'), 'html')
      assert.equal(mimeType.extension('text/html; charset=utf-8'), 'html')
      assert.equal(mimeType.extension('text/html; charset=utf-8 '), 'html')
      assert.equal(mimeType.extension('text/html ; charset=utf-8'), 'html')
    })
  })

  describe('.lookup(extension)', function () {
    it('should return mime type for ".html"', function () {
      assert.equal(mimeType.lookup('.html'), 'text/html')
    })

    it('should return mime type for ".js"', function () {
      assert.equal(mimeType.lookup('.js'), 'application/javascript')
    })

    it('should return mime type for ".json"', function () {
      assert.equal(mimeType.lookup('.json'), 'application/json')
    })

    it('should return mime type for ".rtf"', function () {
      assert.equal(mimeType.lookup('.rtf'), 'application/rtf')
    })

    it('should return mime type for ".txt"', function () {
      assert.equal(mimeType.lookup('.txt'), 'text/plain')
    })

    it('should return mime type for ".xml"', function () {
      assert.equal(mimeType.lookup('.xml'), 'application/xml')
    })

    it('should work without the leading dot', function () {
      assert.equal(mimeType.lookup('html'), 'text/html')
      assert.equal(mimeType.lookup('xml'), 'application/xml')
    })

    it('should be case insensitive', function () {
      assert.equal(mimeType.lookup('HTML'), 'text/html')
      assert.equal(mimeType.lookup('.Xml'), 'application/xml')
    })

    it('should return undefined for unknown extension', function () {
      assert.strictEqual(mimeType.lookup('.bogus'), undefined)
      assert.strictEqual(mimeType.lookup('bogus'), undefined)
    })

    it('should return undefined for non-strings', function () {
      assert.strictEqual(mimeType.lookup(null), undefined)
      assert.strictEqual(mimeType.lookup(undefined), undefined)
      assert.strictEqual(mimeType.lookup(42), undefined)
      assert.strictEqual(mimeType.lookup({}), undefined)
    })
  })

  describe('.lookup(path)', function () {
    it('should return mime type for file name', function () {
      assert.equal(mimeType.lookup('page.html'), 'text/html')
    })

    it('should return mime type for relative path', function () {
      assert.equal(mimeType.lookup('path/to/page.html'), 'text/html')
      assert.equal(mimeType.lookup('path\\to\\page.html'), 'text/html')
    })

    it('should return mime type for absolute path', function () {
      assert.equal(mimeType.lookup('/path/to/page.html'), 'text/html')
      assert.equal(mimeType.lookup('C:\\path\\to\\page.html'), 'text/html')
    })

    it('should be case insensitive', function () {
      assert.equal(mimeType.lookup('/path/to/PAGE.HTML'), 'text/html')
      assert.equal(mimeType.lookup('C:\\path\\to\\PAGE.HTML'), 'text/html')
    })

    it('should return undefined for unknown extension', function () {
      assert.strictEqual(mimeType.lookup('/path/to/file.bogus'), undefined)
    })

    it('should return undefined for path without extension', function () {
      assert.strictEqual(mimeType.lookup('/path/to/json'), undefined)
    })

    describe('path with dotfile', function () {
      it('should return undefined when extension-less', function () {
        assert.strictEqual(mimeType.lookup('/path/to/.json'), undefined)
      })

      it('should return mime type when there is extension', function () {
        assert.strictEqual(mimeType.lookup('/path/to/.config.json'), 'application/json')
      })

      it('should return mime type when there is extension, but no path', function () {
        assert.strictEqual(mimeType.lookup('.config.json'), 'application/json')
      })
    })
  })
})
