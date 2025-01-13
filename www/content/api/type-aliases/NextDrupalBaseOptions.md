[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / NextDrupalBaseOptions

# Type Alias: NextDrupalBaseOptions

> **NextDrupalBaseOptions**: `object`

Defined in: [packages/next-drupal/src/types/next-drupal-base.ts:3](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/types/next-drupal-base.ts#L3)

## Type declaration

### accessToken?

> `optional` **accessToken**: [`AccessToken`](../interfaces/AccessToken.md)

A long-lived access token you can set for the client.

- **Default value**: `null`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#accesstoken)

### apiPrefix?

> `optional` **apiPrefix**: `string`

Set the JSON:API prefix.

- **Default value**: `/jsonapi`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#apiprefix)

### auth?

> `optional` **auth**: [`NextDrupalAuth`](NextDrupalAuth.md)

Override the default auth. You can use this to implement your own authentication mechanism.

[Documentation](https://next-drupal.org/docs/client/configuration#auth)

### debug?

> `optional` **debug**: `boolean`

Set debug to true to enable debug messages.

- **Default value**: `false`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#debug)

### fetcher?

> `optional` **fetcher**: [`Fetcher`](Fetcher.md)

Override the default fetcher. Use this to add your own fetcher ex. axios.

- **Default value**: `fetch`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#fetcher)

### frontPage?

> `optional` **frontPage**: `string`

Set the default frontPage.

- **Default value**: `/home`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#frontpage)

### headers?

> `optional` **headers**: `HeadersInit`

Set custom headers for the fetcher.

- **Default value**: `{ "Content-Type": "application/vnd.api+json", Accept: "application/vnd.api+json" }`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#headers)

### logger?

> `optional` **logger**: [`Logger`](../interfaces/Logger.md)

Override the default logger. You can use this to send logs to a third-party service.

- **Default value**: `console`
- **Required**: _No_

[Documentation](https://next-drupal.org/docs/client/configuration#logger)

### withAuth?

> `optional` **withAuth**: `boolean`

Set whether the client should use authenticated requests by default.

- **Default value**: `true`
- **Required**: \*_No_

[Documentation](https://next-drupal.org/docs/client/configuration#withauth)
