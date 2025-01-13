[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / DataCache

# Interface: DataCache

Defined in: [packages/next-drupal/src/types/next-drupal.ts:51](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal.ts#L51)

## Methods

### del()?

> `optional` **del**(`keys`): `Promise`\<`unknown`\>

Defined in: [packages/next-drupal/src/types/next-drupal.ts:56](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal.ts#L56)

#### Parameters

##### keys

`any`

#### Returns

`Promise`\<`unknown`\>

---

### get()

> **get**(`key`): `Promise`\<`unknown`\>

Defined in: [packages/next-drupal/src/types/next-drupal.ts:52](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal.ts#L52)

#### Parameters

##### key

`any`

#### Returns

`Promise`\<`unknown`\>

---

### set()

> **set**(`key`, `value`, `ttl`?): `Promise`\<`unknown`\>

Defined in: [packages/next-drupal/src/types/next-drupal.ts:54](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal.ts#L54)

#### Parameters

##### key

`any`

##### value

`any`

##### ttl?

`number`

#### Returns

`Promise`\<`unknown`\>
