[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / DrupalClientOptions

# Type Alias: DrupalClientOptions

> **DrupalClientOptions**: [`NextDrupalOptions`](NextDrupalOptions.md) & `object`

Defined in: [packages/next-drupal/src/types/next-drupal-pages.ts:9](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal-pages.ts#L9)

## Type declaration

### serializer?

> `optional` **serializer**: [`Serializer`](../interfaces/Serializer.md)

Override the default data serializer. You can use this to add your own JSON:API data deserializer.

- **Default value**: `jsona`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#serializer)

### useDefaultResourceTypeEntry?

> `optional` **useDefaultResourceTypeEntry**: `boolean`

By default, the client will make a request to JSON:API to retrieve the endpoint url. You can turn this off and use the default endpoint based on the resource name.

- **Default value**: `false`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/configuration#usedefaultresourcetypeentry)
