[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / NextDrupalBase

# Class: NextDrupalBase

Defined in: [packages/next-drupal/src/next-drupal-base.ts:36](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L36)

The base class for NextDrupal clients.

## Extended by

- [`NextDrupal`](NextDrupal.md)

## Constructors

### new NextDrupalBase()

> **new NextDrupalBase**(`baseUrl`, `options`): [`NextDrupalBase`](NextDrupalBase.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:71](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L71)

Instantiates a new NextDrupalBase.

const client = new NextDrupalBase(baseUrl)

#### Parameters

##### baseUrl

`string`

The baseUrl of your Drupal site. Do not add the /jsonapi suffix.

##### options

[`NextDrupalBaseOptions`](../type-aliases/NextDrupalBaseOptions.md) = `{}`

Options for NextDrupalBase.

#### Returns

[`NextDrupalBase`](NextDrupalBase.md)

## Properties

### accessToken?

> `optional` **accessToken**: [`AccessToken`](../interfaces/AccessToken.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:37](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L37)

---

### baseUrl

> **baseUrl**: `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:39](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L39)

---

### fetcher()?

> `optional` **fetcher**: (`input`, `init`?) => `Promise`\<`Response`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:41](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L41)

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

##### input

`RequestInfo` | `URL`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

---

### frontPage

> **frontPage**: `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:43](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L43)

---

### isDebugEnabled

> **isDebugEnabled**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:45](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L45)

---

### logger

> **logger**: [`Logger`](../interfaces/Logger.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:47](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L47)

---

### withAuth

> **withAuth**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:49](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L49)

## Accessors

### apiPrefix

#### Get Signature

> **get** **apiPrefix**(): `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:109](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L109)

##### Returns

`string`

#### Set Signature

> **set** **apiPrefix**(`apiPrefix`): `void`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:102](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L102)

##### Parameters

###### apiPrefix

`string`

##### Returns

`void`

---

### auth

#### Get Signature

> **get** **auth**(): [`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:158](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L158)

##### Returns

[`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

#### Set Signature

> **set** **auth**(`auth`): `void`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:113](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L113)

##### Parameters

###### auth

[`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

##### Returns

`void`

---

### headers

#### Get Signature

> **get** **headers**(): `HeadersInit`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:166](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L166)

##### Returns

`HeadersInit`

#### Set Signature

> **set** **headers**(`headers`): `void`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:162](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L162)

##### Parameters

###### headers

`HeadersInit`

##### Returns

`void`

---

### token

#### Get Signature

> **get** **token**(): [`AccessToken`](../interfaces/AccessToken.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:175](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L175)

##### Returns

[`AccessToken`](../interfaces/AccessToken.md)

#### Set Signature

> **set** **token**(`token`): `void`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:170](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L170)

##### Parameters

###### token

[`AccessToken`](../interfaces/AccessToken.md)

##### Returns

`void`

## Methods

### addLocalePrefix()

> **addLocalePrefix**(`path`, `options`): `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:391](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L391)

Adds a locale prefix to the given path.

#### Parameters

##### path

`string`

The path.

##### options

The options for adding the locale prefix.

###### defaultLocale

`string`

The default locale.

###### locale

`string`

The locale.

#### Returns

`string`

The path with the locale prefix.

---

### buildEndpoint()

> **buildEndpoint**(`options`): `Promise`\<`string`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:304](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L304)

Builds an endpoint URL with the given options.

#### Parameters

##### options

The options for building the endpoint.

###### locale

`string` = `""`

The locale.

###### path

`string` = `""`

The path.

###### searchParams

[`EndpointSearchParams`](../type-aliases/EndpointSearchParams.md)

The search parameters.

#### Returns

`Promise`\<`string`\>

The constructed endpoint URL.

---

### buildUrl()

> **buildUrl**(`path`, `searchParams`?): `URL`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:276](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L276)

Builds a URL with the given path and search parameters.

#### Parameters

##### path

`string`

The URL path.

##### searchParams?

[`EndpointSearchParams`](../type-aliases/EndpointSearchParams.md)

The search parameters.

#### Returns

`URL`

The constructed URL.

---

### constructPathFromSegment()

> **constructPathFromSegment**(`segment`, `options`): `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:335](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L335)

Constructs a path from the given segment and options.

#### Parameters

##### segment

The path segment.

`string` | `string`[]

##### options

The options for constructing the path.

###### defaultLocale

`string`

The default locale.

###### locale

`string`

The locale.

###### pathPrefix

`string`

The path prefix.

#### Returns

`string`

The constructed path.

---

### debug()

> **debug**(`message`): `void`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:538](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L538)

Logs a debug message if debug mode is enabled.

#### Parameters

##### message

`any`

The debug message.

#### Returns

`void`

---

### fetch()

> **fetch**(`input`, `init`): `Promise`\<`Response`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:186](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L186)

Fetches a resource from the given input URL or path.

#### Parameters

##### input

`RequestInfo`

The input URL or path.

##### init

[`FetchOptions`](../interfaces/FetchOptions.md) = `{}`

The fetch options.

#### Returns

`Promise`\<`Response`\>

The fetch response.

---

### getAccessToken()

> **getAccessToken**(`clientIdSecret`?): `Promise`\<[`AccessToken`](../interfaces/AccessToken.md)\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:415](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L415)

Gets an access token using the provided client ID and secret.

#### Parameters

##### clientIdSecret?

[`NextDrupalAuthClientIdSecret`](../interfaces/NextDrupalAuthClientIdSecret.md)

The client ID and secret.

#### Returns

`Promise`\<[`AccessToken`](../interfaces/AccessToken.md)\>

The access token.

---

### getAuthorizationHeader()

> **getAuthorizationHeader**(`auth`): `Promise`\<`string`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:234](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L234)

Gets the authorization header value based on the provided auth configuration.

#### Parameters

##### auth

[`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

The auth configuration.

#### Returns

`Promise`\<`string`\>

The authorization header value.

---

### getErrorsFromResponse()

> **getErrorsFromResponse**(`response`): `Promise`\<`string` \| [`JsonApiError`](../interfaces/JsonApiError.md)[]\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:562](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L562)

Extracts errors from the fetch response.

#### Parameters

##### response

`Response`

The fetch response.

#### Returns

`Promise`\<`string` \| [`JsonApiError`](../interfaces/JsonApiError.md)[]\>

The extracted errors.

---

### throwIfJsonErrors()

> **throwIfJsonErrors**(`response`, `messagePrefix`): `Promise`\<`void`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:549](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L549)

Throws an error if the response contains JSON:API errors.

#### Parameters

##### response

`Response`

The fetch response.

##### messagePrefix

`string` = `""`

The error message prefix.

#### Returns

`Promise`\<`void`\>

#### Throws

The JSON:API errors.

---

### validateDraftUrl()

> **validateDraftUrl**(`searchParams`): `Promise`\<`Response`\>

Defined in: [packages/next-drupal/src/next-drupal-base.ts:500](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L500)

Validates the draft URL using the provided search parameters.

#### Parameters

##### searchParams

`URLSearchParams`

The search parameters.

#### Returns

`Promise`\<`Response`\>

The validation response.
