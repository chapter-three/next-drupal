[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / NextDrupalOptions

# Type Alias: NextDrupalOptions

> **NextDrupalOptions**: [`NextDrupalBaseOptions`](NextDrupalBaseOptions.md) & `object`

Defined in: [packages/next-drupal/src/types/next-drupal.ts:4](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal.ts#L4)

## Type declaration

### cache?

> `optional` **cache**: [`DataCache`](../interfaces/DataCache.md)

Override the default cache.

- **Default value**: `node-cache`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#cache)

### deserializer?

> `optional` **deserializer**: [`JsonDeserializer`](JsonDeserializer.md)

Override the default data deserializer. You can use this to add your own JSON:API data deserializer.

- **Default value**: `(new jsona()).deserialize`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#deserializer)

### throwJsonApiErrors?

> `optional` **throwJsonApiErrors**: `boolean`

If set to true, JSON:API errors are thrown in non-production environments. The errors are shown in the Next.js overlay.

**Default value**: `true`
**Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#throwjsonapierrors)

### useDefaultEndpoints?

> `optional` **useDefaultEndpoints**: `boolean`

By default, the resource endpoint will be based on the resource name. If you turn this off, a JSON:API request will retrieve the resource's endpoint url.

- **Default value**: `true`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#usedefaultendpoints)
