[**mime-type**](../../README.md) • **Docs**

***

[mime-type](../../modules.md) / [index](../README.md) / MimeType

# Class: MimeType

## Indexable

 \[`mimetype`: `string`\]: `string` \| `number` \| `object` \| [`IMimeType`](../interfaces/IMimeType.md)

## Constructors

### new MimeType()

> **new MimeType**(`db`, `duplicationProcessWay`?): [`MimeType`](MimeType.md)

Constructs a MimeType object to manage MIME types and their associated extensions.

#### Parameters

• **db**: [`IMimeTypes`](../interfaces/IMimeTypes.md)

An initial database containing MIME type mappings.

• **duplicationProcessWay?**: [`DuplicationProcessWay`](../enumerations/DuplicationProcessWay.md)

A flag specifying how to handle duplicate MIME type entries.
    If provided, it should be one of:
      - `dupDefault: 0`: Default strategy that resolves duplicates based on source priority.
        See the description for details on this strategy.
      - `dupSkip: 1`: Skip adding the new MIME type if a duplicate entry already exists.
      - `dupOverwrite: 2`: Replace the existing MIME type with the new one if a duplicate is found.
      - `dupAppend: 3`: Add the new MIME type to the end of the existing ones if a duplicate is encountered.
    If not specified, it defaults to the `dupDefault` strategy,
    The `dupDefault` strategy works as follows:
      - If the existing MIME type is 'application/octet-stream', it's not overwritten.
      - If sources are equal and the existing type starts with 'application/', it's preserved.
      - Otherwise, if the new source is considered more authoritative (earlier in the `refSources` array),
        the new type overwrites the old one. The `refSources` array may include server configurations
        and standards bodies, such as ['nginx', 'apache', undefined, 'iana'], with `undefined` representing
        an unspecified or less authoritative source.

#### Returns

[`MimeType`](MimeType.md)

#### Source

[src/index.d.ts:79](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L79)

## Properties

### dup

> **dup**: [`DuplicationProcessWay`](../enumerations/DuplicationProcessWay.md)

the default duplication process way

#### Source

[src/index.d.ts:52](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L52)

***

### dupAppend

> **dupAppend**: `3`

Append the extension to the existing mapping.

#### Source

[src/index.d.ts:43](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L43)

***

### dupDefault

> **dupDefault**: `0`

Uses a default strategy where:
  - If the existing MIME type is 'application/octet-stream', it is not overwritten.
  - If sources are equal and the existing type starts with 'application/', it is retained.
  - Otherwise, if the new source is considered more authoritative (appears earlier in `refSources`),
    the new type will overwrite the old one. The `refSources` array includes server configurations
    and standards bodies, e.g., ['nginx', 'apache', undefined, 'iana'], with `undefined` marking
    an unspecified or less authoritative source.

#### Source

[src/index.d.ts:31](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L31)

***

### dupOverwrite

> **dupOverwrite**: `2`

Overwrite the existing mapping.

#### Source

[src/index.d.ts:39](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L39)

***

### dupSkip

> **dupSkip**: `1`

Skip the existing mapping.

#### Source

[src/index.d.ts:35](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L35)

***

### extensions

> `readonly` **extensions**: `object`

A map of extensions by content-type.

#### Index signature

 \[`mimetype`: `string`\]: `string`

#### Source

[src/index.d.ts:56](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L56)

***

### types

> **types**: `object`

A map of types by extension.

#### Index signature

 \[`extension`: `string`\]: `string`

#### Source

[src/index.d.ts:48](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L48)

## Methods

### charset()

> **charset**(`type`): `string` \| `boolean`

Get the default charset for a MIME type.

#### Parameters

• **type**: `string`

a MIME type

#### Returns

`string` \| `boolean`

#### Source

[src/index.d.ts:84](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L84)

***

### clear()

> **clear**(`filter`?): `number`

clear the mime-types.

#### Parameters

• **filter?**: `string` \| [`FilterFunctionType`](../type-aliases/FilterFunctionType.md)

optional glob or function to remove items. defaults to clear all.

#### Returns

`number`

the removed items count.

#### Source

[src/index.d.ts:152](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L152)

***

### contentType()

> **contentType**(`str`): `string` \| `boolean`

Create a full Content-Type header given a MIME type or extension.

#### Parameters

• **str**: `string`

a MIME type or extension

#### Returns

`string` \| `boolean`

#### Source

[src/index.d.ts:89](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L89)

***

### define()

> **define**(`type`, `mime`, `dup`?): `string`[]

Add a custom mime/extension mapping

#### Parameters

• **type**: `string`

mime type

• **mime**: [`IMimeType`](../interfaces/IMimeType.md)

mime object
 * "source": "iana",
 * "charset": "UTF-8",
 * "compressible": true,
 * "extensions": ["js"]

• **dup?**: [`DuplicationProcessWay`](../enumerations/DuplicationProcessWay.md)

The optional conflict resolution strategy, defaults to the this.dup. Can be one of:
  - `this.dupSkip`: Skip the existing mapping.
  - `this.dupAppend`: Append the new type to the existing mapping.
  - `this.dupOverwrite`: Overwrite the existing mapping.
  - `this.dupDefault`: Uses a default strategy where:
      - If the existing MIME type is 'application/octet-stream', it is not overwritten.
      - If sources are equal and the existing type starts with 'application/', it is retained.
      - Otherwise, if the new source is considered more authoritative (appears earlier in `refSources`),
        the new type will overwrite the old one. The `refSources` array includes server configurations
        and standards bodies, e.g., ['nginx', 'apache', undefined, 'iana'], with `undefined` marking
        an unspecified or less authoritative source.

#### Returns

`string`[]

the added extensions

#### Source

[src/index.d.ts:133](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L133)

***

### delete()

> **delete**(`type`): `boolean`

remove the specified mime-type.

#### Parameters

• **type**: `string`

the mime type.

#### Returns

`boolean`

return true if removed successful.

#### Source

[src/index.d.ts:146](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L146)

***

### exist()

> **exist**(`type`): `boolean`

Whether the mime type is exist.

#### Parameters

• **type**: `string`

the mime type

#### Returns

`boolean`

#### Source

[src/index.d.ts:110](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L110)

***

### extension()

> **extension**(`type`): `string` \| `boolean`

Get the default extension for a MIME type.

#### Parameters

• **type**: `string`

a MIME type

#### Returns

`string` \| `boolean`

#### Source

[src/index.d.ts:94](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L94)

***

### glob()

> **glob**(`pattern`): `string`[]

Return all MIME types which matching a pattern
   [spec](http://tools.ietf.org/html/rfc2616#section-14.1)

#### Parameters

• **pattern**: `string`

the mime type pattern, For example "video/*", "audio/*", ..

#### Returns

`string`[]

#### Source

[src/index.d.ts:105](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L105)

***

### load()

> **load**(`mimes`, `duplicationProcessWay`?): `number`

load mime-types from db.

#### Parameters

• **mimes**: [`IMimeTypes`](../interfaces/IMimeTypes.md)

the mimes to add

• **duplicationProcessWay?**: [`DuplicationProcessWay`](../enumerations/DuplicationProcessWay.md)

optional duplication process way, defaults to the this.dup.

#### Returns

`number`

the count of added items.

#### Source

[src/index.d.ts:140](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L140)

***

### lookup()

> **lookup**(`aPath`): `string` \| `string`[]

Lookup the MIME types for a file path/extension.

#### Parameters

• **aPath**: `string`

a file path/extension.

#### Returns

`string` \| `string`[]

#### Source

[src/index.d.ts:99](https://github.com/snowyu/mime-type.js/blob/1c1aa7c4e9a1df1facf3e42a5246849918661de9/src/index.d.ts#L99)
