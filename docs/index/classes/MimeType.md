[**mime-type**](../../README.md)

***

[mime-type](../../modules.md) / [index](../README.md) / MimeType

# Class: MimeType

Defined in: [src/index.js:40](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L40)

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

Defined in: [src/index.js:40](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L40)

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

Defined in: [src/index.js:60](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L60)

***

### dupAppend

> **dupAppend**: `number`

Defined in: [src/index.js:19](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L19)

***

### dupDefault

> **dupDefault**: `number`

Defined in: [src/index.js:16](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L16)

***

### dupOverwrite

> **dupOverwrite**: `number`

Defined in: [src/index.js:18](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L18)

***

### dupSkip

> **dupSkip**: `number`

Defined in: [src/index.js:17](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L17)

***

### exist()

> **exist**: (`v`) => `boolean`

Defined in: [src/index.js:183](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L183)

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

Defined in: [src/index.js:74](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L74)

#### Parameters

##### type

`any`

#### Returns

`any`

***

### clear()

> **clear**(`filter`): `number`

Defined in: [src/index.js:321](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L321)

#### Parameters

##### filter

`any`

#### Returns

`number`

***

### contentType()

> **contentType**(`str`): `any`

Defined in: [src/index.js:99](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L99)

#### Parameters

##### str

`any`

#### Returns

`any`

***

### define()

> **define**(`type`, `mime`, `dup`): `any`[]

Defined in: [src/index.js:207](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L207)

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

Defined in: [src/index.js:293](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L293)

#### Parameters

##### type

`any`

#### Returns

`boolean`

***

### extension()

> **extension**(`type`): `any`

Defined in: [src/index.js:123](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L123)

#### Parameters

##### type

`any`

#### Returns

`any`

***

### glob()

> **glob**(`pattern`): `string`[]

Defined in: [src/index.js:166](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L166)

#### Parameters

##### pattern

`any`

#### Returns

`string`[]

***

### load()

> **load**(`mimes`, `duplicationProcessWay`): `number`

Defined in: [src/index.js:274](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L274)

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

Defined in: [src/index.js:142](https://github.com/snowyu/mime-type.js/blob/9760c907e1fdc320b5be12e0479a34e07e83ea04/src/index.js#L142)

#### Parameters

##### aPath

`any`

#### Returns

`any`
