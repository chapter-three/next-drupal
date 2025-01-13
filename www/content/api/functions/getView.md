[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / getView

# Function: getView()

> **getView**\<`T`\>(`name`, `options`?): `Promise`\<\{ `links`: \{ \[key in "next" \| "prev" \| "self"\]?: \{ href: "string" \} \}; `meta`: `Record`\<`string`, `any`\>; `results`: `T`; \}\>

Defined in: [packages/next-drupal/src/deprecated/get-view.ts:5](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/deprecated/get-view.ts#L5)

## Type Parameters

• **T**

## Parameters

### name

`string`

### options?

`object` & [`JsonApiWithLocaleOptions`](../type-aliases/JsonApiWithLocaleOptions.md)

## Returns

`Promise`\<\{ `links`: \{ \[key in "next" \| "prev" \| "self"\]?: \{ href: "string" \} \}; `meta`: `Record`\<`string`, `any`\>; `results`: `T`; \}\>
