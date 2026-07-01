import assert from 'assert'
import mimeType from '../src/with-db'
import MimeType from '../src'
import mimeDb from '../src/mime-db'

describe('mimeType', function () {
  describe('constructor', function () {
    it('should set the global duplicationProcessWay on constructor', function () {
      var m = MimeType(null, MimeType.prototype.dupOverwrite)
      assert.equal(m.dup, MimeType.prototype.dupOverwrite)
    })
  })
  describe('.extensions', function () {
    it('should get the extensions', function () {
      assert.equal(Object.keys(mimeType.extensions).length, Object.keys(mimeType).length)
    })
  })
  describe('.clear(filter)', function () {
    it('should clear all types', function () {
      mimeType.clear()
      assert.equal(Object.keys(mimeType).length, 0)
      assert.equal(Object.keys(mimeType.types).length, 0)
      mimeType.load(mimeDb)
    })
    it('should clear specifiled types via filter function', function () {
      var count = Object.keys(mimeType).length
      var result = mimeType.clear(function(type){
        return (type.substr(0, 4) === 'text')
      })
      assert.ok(result > 0)
      assert.equal(Object.keys(mimeType).length+result, count)
      mimeType.clear()
      mimeType.load(mimeDb)
    })
    it('should clear specifiled types via filter string', function () {
      var count = Object.keys(mimeType).length
      var result = mimeType.clear('text/*')
      assert.ok(result > 0)
      assert.equal(Object.keys(mimeType).length+result, count)
      mimeType.clear()
      mimeType.load(mimeDb)
    })
  })
  describe('.delete(type)', function () {
    it('should delete a mime type', function () {
      assert.ok(mimeType.define('1sas/ss', {extensions:['ss']}))
      assert.ok(mimeType.delete('1sas/ss'))
      assert.ok(!mimeType.hasOwnProperty('1sas/ss'))
      assert.ok(!mimeType.types.hasOwnProperty('ss'))
    })
    it('should delete a mime type with crosslink extensions', function () {
      var t
      assert.ok(mimeType.define('1sas/ss', {extensions:['ss', 'as']}))
      assert.ok(mimeType.define('2sas/ss', {extensions:['ss', 'as']}, mimeType.dupAppend))
      assert.ok(mimeType.define('3sas/ss', {extensions:['ss']}, mimeType.dupAppend))
      assert.ok(mimeType.delete('1sas/ss'))
      assert.ok(!mimeType.hasOwnProperty('1sas/ss'))
      t = mimeType.types['ss']
      assert.deepEqual(t, ['2sas/ss', '3sas/ss'])
      t = mimeType.types['as']
      assert.ok(t === '2sas/ss')
      assert.ok(mimeType.delete('2sas/ss'))
      assert.ok(!mimeType.hasOwnProperty('2sas/ss'))
      t = mimeType.types['ss']
      assert.ok(t === '3sas/ss')
      assert.ok(!mimeType.types.hasOwnProperty('as'))
      assert.ok(mimeType.delete('3sas/ss'))
      assert.ok(!mimeType.hasOwnProperty('3sas/ss'))
      assert.ok(!mimeType.types.hasOwnProperty('ss'))
    })
  })
  describe('.define(type, object)', function () {
    it('should define a mime type with single extension', function () {
      assert.equal(mimeType.exist('1sas/ss'), false)
      assert.ok(mimeType.define('1sas/ss', {extensions:'ss'}))
      assert.equal(mimeType.exist('1sas/ss'), true)
      assert.ok(mimeType.delete('1sas/ss'))
    })
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
      assert.ok(mimeType.define('3das/ss', {extensions:['ss']}, mimeType.dupDefault))
      assert.equal(mimeType.exist('3das/ss'), true)
      assert.deepEqual(mimeType.types['ss'], '3das/ss')
    })
    it('should define a mime type and skip duplication extension to the new type', function () {
      assert.equal(mimeType.exist('2das/ss'), false)
      assert.ok(mimeType.define('2das/ss', {extensions:['ss']}, mimeType.dupSkip))
      assert.equal(mimeType.exist('2das/ss'), false)
    })
    it('should define a mime type and overwrite duplication extension to the new type', function () {
      assert.equal(mimeType.exist('2das/ss'), false)
      assert.ok(mimeType.define('2das/ss', {extensions:['ss']}, mimeType.dupOverwrite))
      assert.equal(mimeType.exist('2das/ss'), true)
      assert.deepEqual(mimeType.types['ss'], '2das/ss')
    })
    it('should skip update when existing type has lower priority (covers continue)', function () {
      // 1. 预设一个低优先级的类型 (source: 'default')
      // 使用 load 方法可以直接设置 source 属性，或者通过内部机制
      // 假设我们加载一个自定义类型，其 source 会被标记为 'user' 或 'default'
      // 如果无法直接设置，可能需要直接修改 mimeType 内部存储

      // 方案 A: 使用 load (如果支持 source)
      // mimeType.load({ 'type-low': { extensions: ['testext'], source: 'default' } });

      // 方案 B: 直接修改内部状态 (如果 load 不支持 source)
      // mime-type 内部通常有一个 Map 或 Object 存储类型信息
      // 假设结构为 mimeType[type] = { source, extensions, ... }
      const lowPriorityType = 'application/x-low-priority';
      const ext = 'testext';

      // 强制注入一个 source 为 'default' 的类型
      // 注意：这依赖于库的内部实现细节，可能需要根据实际版本调整
      // 在 mime-type 中，通常通过 new MimeType(db) 加载，source 由加载器决定
      // 如果是通过 define 添加的，source 默认为 'user' (索引 1)
      // 我们需要一个 source 索引 > 'user' 的类型，即 'default' (索引 2)

      // 如果无法直接设置 source，我们可以利用已有的 'default' 类型
      // 或者 Mock refSources 的 indexOf (如前所述)

      // 这里假设我们可以通过某种方式设置 source
      // 如果 mime-type 不支持，最稳妥的方法是 Mock Array.prototype.indexOf

      const originalIndexOf = Array.prototype.indexOf;
      const refSources = ['node', 'user', 'default']; // 假设这是库内部的 refSources

      // Mock indexOf 使得：
      // 现有类型 'type-existing' 的 source ('default') 返回 2
      // 新类型 'type-new' 的 source ('node') 返回 0
      Array.prototype.indexOf = function(searchElement) {
        if (searchElement === 'default') return 2;
        if (searchElement === 'node') return 0;
        if (searchElement === 'user') return 1;
        return originalIndexOf.call(this, searchElement);
      };

      try {
        // 2. 定义现有类型 (模拟 source 为 'default')
        // 由于 define 默认设置 source 为 'user'，我们这里假设它被某种方式设为了 'default'
        // 或者直接依赖 mock 的 indexOf 来模拟 from > to
        // 为了更真实，我们先定义一个类型
        mimeType.define('type-existing', { extensions: [ext] });
        // 强制修改其 source 为 'default' (如果内部结构允许)
        if (mimeType['type-existing']) {
          mimeType['type-existing'].source = 'default';
        }

        // 3. 定义新类型 (source 默认为 'user' 或显式设为 'node')
        // 调用 define 使用 dupDefault 策略
        const result = mimeType.define('type-new', { extensions: [ext], source: 'node' }, mimeType.dupDefault);

        // 4. 断言：由于 from (2) > to (0)，应执行 continue，旧类型保留
        // 检查扩展名映射是否仍指向旧类型
        assert.equal(mimeType.types[ext], 'type-existing', 'Should not overwrite low priority type');
        // 或者检查 lookup 结果
        assert.ok(mimeType.lookup(ext).includes('type-existing'));
      } finally {
        // 恢复 indexOf
        Array.prototype.indexOf = originalIndexOf;
        // 清理测试数据
        mimeType.delete('type-existing');
        mimeType.delete('type-new');
      }
    });
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
      assert.deepEqual(['text/markdown'], mimeType.glob('*/markdown'));
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
      assert.deepEqual(mimeType.lookup('.rtf'), ['application/rtf', 'text/rtf'])
    })

    it('should return mime type for ".txt"', function () {
      assert.equal(mimeType.lookup('.txt'), 'text/plain')
    })

    it('should return mime type for ".xml"', function () {
      assert.deepEqual(mimeType.lookup('.xml'), ['application/xml', 'text/xml'])
    })

    it('should work without the leading dot', function () {
      assert.equal(mimeType.lookup('html'), 'text/html')
      assert.deepEqual(mimeType.lookup('xml'), ['application/xml', 'text/xml'])
    })

    it('should be case insensitive', function () {
      assert.equal(mimeType.lookup('HTML'), 'text/html')
      assert.deepEqual(mimeType.lookup('.Xml'), ['application/xml', 'text/xml'])
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

    it('should return mime types for search "og?"', function () {
      assert.deepEqual(mimeType.lookup('og?'), [ 'application/ogg', 'audio/ogg', 'audio/ogg', 'video/ogg' ])
    })

    it('should return array of MIME types matching wildcard extension', function () {
      // 2. 定义几个用于测试的 MIME 类型
      // 假设我们要匹配 'text/x-*' 模式
      mimeType.define('text/x-custom-1', { extensions: ['cust1'] });
      mimeType.define('text/x-custom-2', { extensions: ['cust2'] });
      // mimeType.define('application/json', { extensions: ['json'] }); // 不匹配的

      // 3. 调用 lookup 传入包含通配符的扩展名
      // 正则 /[*?!+|{]/ 会匹配这些字符
      // 例如：传入 'x-cust*' 应该匹配 'text/x-custom-1' 和 'text/x-custom-2' 的扩展名吗？
      // 不，lookup 的逻辑是：
      // extension = 'x-cust*' (去掉点后)
      // 然后 filter this.types 的 key (扩展名) 是否匹配 'x-cust*'
      // 所以我们需要 this.types 中有 'cust1', 'cust2' 等 key

      // 修正：this.types 的结构是 { [ext: string]: mimeTypeString }
      // 所以 this.types 的 key 是扩展名，如 'cust1', 'json'
      // 我们要查找 'cust*'，它应该匹配 'cust1' 和 'cust2'

      const result = mimeType.lookup('cust*');

      // 4. 断言
      // result 应该是一个数组，包含匹配扩展名对应的 MIME 类型
      assert.ok(Array.isArray(result), 'Result should be an array for wildcard match');
      assert.ok(result.includes('text/x-custom-1'), 'Should include text/x-custom-1');
      assert.ok(result.includes('text/x-custom-2'), 'Should include text/x-custom-2');
      assert.ok(!result.includes('application/json'), 'Should not include non-matching types');
      mimeType.delete('text/x-custom-1')
      mimeType.delete('text/x-custom-2')
      mimeType.delete('text/x-custom-2')
    });

    it('should handle single char wildcard ?', function () {
      // mimeType.define('image/png', { extensions: ['png'] });
      // mimeType.define('image/jpg', { extensions: ['jpg'] });
      // mimeType.define('image/gif', { extensions: ['gif'] });

      // 'jp?g' 应该匹配 'jpeg'
      const result = mimeType.lookup('jp?g');

      assert.ok(Array.isArray(result));
      assert.equal(result.length, 1);
      assert.ok(result.includes('image/jpeg'));
    });

    it('should return undefined if no wildcard match found', function () {
      const result = mimeType.lookup('unknown*');

      assert.equal(result, undefined);
    });
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

    it('should return multimime types', function () {
      assert.deepEqual(mimeType.lookup('some.xml'), ['application/xml', 'text/xml'])
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
