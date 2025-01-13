[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / DrupalSearchApiJsonApiResponse

# Interface: DrupalSearchApiJsonApiResponse

Defined in: [packages/next-drupal/src/types/drupal.ts:84](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/drupal.ts#L84)

## Extends

- [`JsonApiResponse`](JsonApiResponse.md)

## Indexable

\[`key`: `string`\]: `any`

## Properties

### data

> **data**: `Record`\<`string`, `any`\>[]

Defined in: [packages/next-drupal/src/types/resource.ts:12](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L12)

#### Inherited from

[`JsonApiResponse`](JsonApiResponse.md).[`data`](JsonApiResponse.md#data)

---

### errors

> **errors**: [`JsonApiError`](JsonApiError.md)[]

Defined in: [packages/next-drupal/src/types/resource.ts:13](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L13)

#### Inherited from

[`JsonApiResponse`](JsonApiResponse.md).[`errors`](JsonApiResponse.md#errors)

---

### included?

> `optional` **included**: `Record`\<`string`, `any`\>[]

Defined in: [packages/next-drupal/src/types/resource.ts:19](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L19)

#### Inherited from

[`JsonApiResponse`](JsonApiResponse.md).[`included`](JsonApiResponse.md#included)

---

### jsonapi?

> `optional` **jsonapi**: `object`

Defined in: [packages/next-drupal/src/types/resource.ts:8](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L8)

#### meta

> **meta**: `Record`\<`string`, `any`\>[]

#### version

> **version**: `string`

#### Inherited from

[`JsonApiResponse`](JsonApiResponse.md).[`jsonapi`](JsonApiResponse.md#jsonapi)

---

### links?

> `optional` **links**: [`JsonApiLinks`](JsonApiLinks.md)

Defined in: [packages/next-drupal/src/types/resource.ts:18](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/resource.ts#L18)

#### Inherited from

[`JsonApiResponse`](JsonApiResponse.md).[`links`](JsonApiResponse.md#links)

---

### meta

> **meta**: `object` & `object`

Defined in: [packages/next-drupal/src/types/drupal.ts:85](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/drupal.ts#L85)

#### Type declaration

##### count

> **count**: `number`

#### Type declaration

##### facets?

> `optional` **facets**: [`DrupalSearchApiFacet`](DrupalSearchApiFacet.md)[]

#### Overrides

[`JsonApiResponse`](JsonApiResponse.md).[`meta`](JsonApiResponse.md#meta)
