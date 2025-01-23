[**mime-type**](../../README.md)

***

[mime-type](../../modules.md) / [index](../README.md) / MimeType

# Class: MimeType

Defined in: [src/index.js:39](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L39)

Constructs a MimeType object to manage MIME types and their associated extensions.

## Param

An initial database containing MIME type mappings.

## Param

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

## Constructors

### new MimeType()

> **new MimeType**(`db`, `duplicationProcessWay`?): [`MimeType`](MimeType.md)

Defined in: [src/index.js:39](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L39)

Constructs a MimeType object to manage MIME types and their associated extensions.

#### Parameters

##### db

`any`

An initial database containing MIME type mappings.

##### duplicationProcessWay?

`number`

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

## Properties

### dup

> **dup**: `number`

Defined in: [src/index.js:59](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L59)

***

### dupAppend

> **dupAppend**: `number`

Defined in: [src/index.js:18](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L18)

***

### dupDefault

> **dupDefault**: `number`

Defined in: [src/index.js:15](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L15)

***

### dupOverwrite

> **dupOverwrite**: `number`

Defined in: [src/index.js:17](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L17)

***

### dupSkip

> **dupSkip**: `number`

Defined in: [src/index.js:16](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L16)

***

### exist()

> **exist**: (`v`) => `boolean`

Defined in: [src/index.js:182](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L182)

Determines whether an object has a property with the specified name.

#### Parameters

##### v

`PropertyKey`

A property name.

#### Returns

`boolean`

## Methods

### charset()

> **charset**(`type`): `any`

Defined in: [src/index.js:73](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L73)

#### Parameters

##### type

`any`

#### Returns

`any`

***

### clear()

> **clear**(`filter`): `number`

Defined in: [src/index.js:320](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L320)

#### Parameters

##### filter

`any`

#### Returns

`number`

***

### contentType()

> **contentType**(`str`): `any`

Defined in: [src/index.js:98](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L98)

#### Parameters

##### str

`any`

#### Returns

`any`

***

### define()

> **define**(`type`, `mime`, `dup`): `any`[]

Defined in: [src/index.js:206](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L206)

#### Parameters

##### type

`any`

##### mime

`any`

##### dup

`any`

#### Returns

`any`[]

***

### delete()

> **delete**(`type`): `boolean`

Defined in: [src/index.js:292](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L292)

#### Parameters

##### type

`any`

#### Returns

`boolean`

***

### extension()

> **extension**(`type`): `any`

Defined in: [src/index.js:122](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L122)

#### Parameters

##### type

`any`

#### Returns

`any`

***

### glob()

> **glob**(`pattern`): `string`[]

Defined in: [src/index.js:165](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L165)

#### Parameters

##### pattern

`any`

#### Returns

`string`[]

***

### load()

> **load**(`mimes`, `duplicationProcessWay`): `number`

Defined in: [src/index.js:273](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L273)

#### Parameters

##### mimes

`any`

##### duplicationProcessWay

`any`

#### Returns

`number`

***

### lookup()

> **lookup**(`aPath`): `any`

Defined in: [src/index.js:141](https://github.com/snowyu/mime-type.js/blob/f95519c7d0f59cc981e45696b6b0461d0cc9022d/src/index.js#L141)

#### Parameters

##### aPath

`any`

#### Returns

`any`
