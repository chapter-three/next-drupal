[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / JsonApiErrors

# Class: JsonApiErrors

Defined in: [packages/next-drupal/src/jsonapi-errors.ts:16](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/jsonapi-errors.ts#L16)

## Extends

- `Error`

## Constructors

### new JsonApiErrors()

> **new JsonApiErrors**(`errors`, `statusCode`, `messagePrefix`): [`JsonApiErrors`](JsonApiErrors.md)

Defined in: [packages/next-drupal/src/jsonapi-errors.ts:20](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/jsonapi-errors.ts#L20)

#### Parameters

##### errors

`string` | [`JsonApiError`](../interfaces/JsonApiError.md)[]

##### statusCode

`number`

##### messagePrefix

`string` = `""`

#### Returns

[`JsonApiErrors`](JsonApiErrors.md)

#### Overrides

`Error.constructor`

## Properties

### errors

> **errors**: `string` \| [`JsonApiError`](../interfaces/JsonApiError.md)[]

Defined in: [packages/next-drupal/src/jsonapi-errors.ts:17](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/jsonapi-errors.ts#L17)

---

### message

> **message**: `string`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

---

### name

> **name**: `string`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

---

### stack?

> `optional` **stack**: `string`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

---

### statusCode

> **statusCode**: `number`

Defined in: [packages/next-drupal/src/jsonapi-errors.ts:18](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/jsonapi-errors.ts#L18)

---

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node_modules/@types/node/globals.d.ts:28

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

---

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node_modules/@types/node/globals.d.ts:30

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node_modules/@types/node/globals.d.ts:21

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

---

### formatMessage()

> `static` **formatMessage**(`errors`): `string`

Defined in: [packages/next-drupal/src/jsonapi-errors.ts:34](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/jsonapi-errors.ts#L34)

#### Parameters

##### errors

`string` | [`JsonApiError`](../interfaces/JsonApiError.md)[]

#### Returns

`string`
