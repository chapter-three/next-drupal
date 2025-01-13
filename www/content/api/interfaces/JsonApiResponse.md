[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / JsonApiResponse

# Interface: JsonApiResponse

Defined in: [packages/next-drupal/src/types/resource.ts:7](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L7)

## Extends

- `Record`\<`string`, `any`\>

## Extended by

- [`DrupalSearchApiJsonApiResponse`](DrupalSearchApiJsonApiResponse.md)

## Indexable

\[`key`: `string`\]: `any`

## Properties

### data

> **data**: `Record`\<`string`, `any`\>[]

Defined in: [packages/next-drupal/src/types/resource.ts:12](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L12)

---

### errors

> **errors**: [`JsonApiError`](JsonApiError.md)[]

Defined in: [packages/next-drupal/src/types/resource.ts:13](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L13)

---

### included?

> `optional` **included**: `Record`\<`string`, `any`\>[]

Defined in: [packages/next-drupal/src/types/resource.ts:19](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L19)

---

### jsonapi?

> `optional` **jsonapi**: `object`

Defined in: [packages/next-drupal/src/types/resource.ts:8](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L8)

#### meta

> **meta**: `Record`\<`string`, `any`\>[]

#### version

> **version**: `string`

---

### links?

> `optional` **links**: [`JsonApiLinks`](JsonApiLinks.md)

Defined in: [packages/next-drupal/src/types/resource.ts:18](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L18)

---

### meta

> **meta**: `object`

Defined in: [packages/next-drupal/src/types/resource.ts:14](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L14)

#### Index Signature

\[`key`: `string`\]: `any`

#### count

> **count**: `number`
