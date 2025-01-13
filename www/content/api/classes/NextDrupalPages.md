[**next-drupal**](../README.md)

---

[next-drupal](../globals.md) / NextDrupalPages

# Class: NextDrupalPages

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:34](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L34)

The NextDrupalPages class extends the NextDrupal class and provides methods
for interacting with a Drupal backend in the context of Next.js pages.

## Extends

- [`NextDrupal`](NextDrupal.md)

## Constructors

### new NextDrupalPages()

> **new NextDrupalPages**(`baseUrl`, `options`): [`NextDrupalPages`](NextDrupalPages.md)

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:45](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L45)

Instantiates a new NextDrupalPages.

const client = new NextDrupalPages(baseUrl)

#### Parameters

##### baseUrl

`string`

The baseUrl of your Drupal site. Do not add the /jsonapi suffix.

##### options

[`DrupalClientOptions`](../type-aliases/DrupalClientOptions.md) = `{}`

Options for the client. See Experiment_DrupalClientOptions.

#### Returns

[`NextDrupalPages`](NextDrupalPages.md)

#### Overrides

[`NextDrupal`](NextDrupal.md).[`constructor`](NextDrupal.md#constructors)

## Properties

### accessToken?

> `optional` **accessToken**: [`AccessToken`](../interfaces/AccessToken.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:37](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L37)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`accessToken`](NextDrupal.md#accesstoken)

---

### baseUrl

> **baseUrl**: `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:39](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L39)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`baseUrl`](NextDrupal.md#baseurl-1)

---

### cache?

> `optional` **cache**: [`DataCache`](../interfaces/DataCache.md)

Defined in: [packages/next-drupal/src/next-drupal.ts:52](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L52)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`cache`](NextDrupal.md#cache)

---

### deserializer

> **deserializer**: [`JsonDeserializer`](../type-aliases/JsonDeserializer.md)

Defined in: [packages/next-drupal/src/next-drupal.ts:54](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L54)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`deserializer`](NextDrupal.md#deserializer)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`fetcher`](NextDrupal.md#fetcher)

---

### frontPage

> **frontPage**: `string`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:43](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L43)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`frontPage`](NextDrupal.md#frontpage)

---

### getPathsFromContext()

> **getPathsFromContext**: (`types`, `context`, `options`?) => `Promise`\<(`string` \| \{ `locale`: `string`; `params`: \{ `slug`: `string`[]; \}; \})[]\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:273](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L273)

Gets static paths from the context.

#### Parameters

##### types

The types of the resources.

`string` | `string`[]

##### context

`GetStaticPathsContext`

The static paths context.

##### options?

`object` & [`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md)

Options for the request.

#### Returns

`Promise`\<(`string` \| \{ `locale`: `string`; `params`: \{ `slug`: `string`[]; \}; \})[]\>

The fetched static paths.

---

### isDebugEnabled

> **isDebugEnabled**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:45](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L45)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`isDebugEnabled`](NextDrupal.md#isdebugenabled)

---

### logger

> **logger**: [`Logger`](../interfaces/Logger.md)

Defined in: [packages/next-drupal/src/next-drupal-base.ts:47](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L47)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`logger`](NextDrupal.md#logger)

---

### throwJsonApiErrors

> **throwJsonApiErrors**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal.ts:56](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L56)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`throwJsonApiErrors`](NextDrupal.md#throwjsonapierrors)

---

### useDefaultEndpoints

> **useDefaultEndpoints**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal.ts:58](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L58)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`useDefaultEndpoints`](NextDrupal.md#usedefaultendpoints)

---

### withAuth

> **withAuth**: `boolean`

Defined in: [packages/next-drupal/src/next-drupal-base.ts:49](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-base.ts#L49)

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`withAuth`](NextDrupal.md#withauth)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`apiPrefix`](NextDrupal.md#apiprefix)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`auth`](NextDrupal.md#auth)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`headers`](NextDrupal.md#headers)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`token`](NextDrupal.md#token)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`addLocalePrefix`](NextDrupal.md#addlocaleprefix)

---

### buildEndpoint()

> **buildEndpoint**(`params`): `Promise`\<`string`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:699](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L699)

Builds an endpoint URL for the specified parameters.

#### Parameters

##### params

`object` & `object` = `{}`

The parameters for the endpoint.

#### Returns

`Promise`\<`string`\>

The built endpoint URL.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`buildEndpoint`](NextDrupal.md#buildendpoint)

---

### buildMenuTree()

> **buildMenuTree**(`links`, `parent`): `DrupalMenuTree`

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:84](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L84)

#### Parameters

##### links

[`DrupalMenuItem`](../interfaces/DrupalMenuItem.md)[]

##### parent

`string` = `""`

#### Returns

`DrupalMenuTree`

---

### buildStaticPathsFromResources()

> **buildStaticPathsFromResources**(`resources`, `options`?): `object`[]

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:358](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L358)

Builds static paths from resources.

#### Parameters

##### resources

`object`[]

The resources.

##### options?

Options for the request.

###### locale

`string`

###### pathPrefix

`string`

#### Returns

`object`[]

The built static paths.

---

### buildStaticPathsParamsFromPaths()

> **buildStaticPathsParamsFromPaths**(`paths`, `options`?): `object`[]

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:387](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L387)

Builds static paths parameters from paths.

#### Parameters

##### paths

`string`[]

The paths.

##### options?

Options for the request.

###### locale

`string`

###### pathPrefix

`string`

#### Returns

`object`[]

The built static paths parameters.

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`buildUrl`](NextDrupal.md#buildurl)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`constructPathFromSegment`](NextDrupal.md#constructpathfromsegment)

---

### createFileResource()

> **createFileResource**\<`T`\>(`type`, `body`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:149](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L149)

Creates a new file resource for the specified media type.

#### Type Parameters

• **T** = [`DrupalFile`](../interfaces/DrupalFile.md)

#### Parameters

##### type

`string`

The type of the media.

##### body

[`JsonApiCreateFileResourceBody`](../interfaces/JsonApiCreateFileResourceBody.md)

The body of the file resource.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The created file resource.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`createFileResource`](NextDrupal.md#createfileresource)

---

### createResource()

> **createResource**\<`T`\>(`type`, `body`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:101](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L101)

Creates a new resource of the specified type.

#### Type Parameters

• **T** _extends_ [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### type

`string`

The type of the resource.

##### body

[`JsonApiCreateResourceBody`](../interfaces/JsonApiCreateResourceBody.md)

The body of the resource.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The created resource.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`createResource`](NextDrupal.md#createresource)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`debug`](NextDrupal.md#debug)

---

### deleteResource()

> **deleteResource**(`type`, `uuid`, `options`?): `Promise`\<`boolean`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:253](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L253)

Deletes an existing resource of the specified type.

#### Parameters

##### type

`string`

The type of the resource.

##### uuid

`string`

The UUID of the resource.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`boolean`\>

True if the resource was deleted, false otherwise.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`deleteResource`](NextDrupal.md#deleteresource)

---

### deserialize()

> **deserialize**(`body`, `options`?): `TJsonaModel` \| `TJsonaModel`[]

Defined in: [packages/next-drupal/src/next-drupal.ts:934](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L934)

Deserializes the response body.

#### Parameters

##### body

`any`

The response body.

##### options?

`any`

Options for deserialization.

#### Returns

`TJsonaModel` \| `TJsonaModel`[]

The deserialized response body.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`deserialize`](NextDrupal.md#deserialize)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`fetch`](NextDrupal.md#fetch)

---

### fetchResourceEndpoint()

> **fetchResourceEndpoint**(`type`, `locale`?): `Promise`\<`URL`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:743](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L743)

Fetches the endpoint URL for the specified resource type.

#### Parameters

##### type

`string`

The type of the resource.

##### locale?

`string`

The locale for the request.

#### Returns

`Promise`\<`URL`\>

The fetched endpoint URL.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`fetchResourceEndpoint`](NextDrupal.md#fetchresourceendpoint)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getAccessToken`](NextDrupal.md#getaccesstoken)

---

### getAuthFromContextAndOptions()

> **getAuthFromContextAndOptions**(`context`, `options`): `boolean` \| [`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:521](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L521)

Gets the authentication configuration from the context and options.

#### Parameters

##### context

`GetStaticPropsContext`

The static props context.

##### options

[`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md)

Options for the request.

#### Returns

`boolean` \| [`NextDrupalAuth`](../type-aliases/NextDrupalAuth.md)

The authentication configuration.

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getAuthorizationHeader`](NextDrupal.md#getauthorizationheader)

---

### getEntryForResourceType()

> **getEntryForResourceType**(`resourceType`, `locale`?): `Promise`\<`string`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:73](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L73)

Gets the entry point for a given resource type.

#### Parameters

##### resourceType

`string`

The resource type.

##### locale?

`string`

The locale.

#### Returns

`Promise`\<`string`\>

The entry point URL.

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getErrorsFromResponse`](NextDrupal.md#geterrorsfromresponse)

---

### getIndex()

> **getIndex**(`locale`?, `options`?): `Promise`\<[`JsonApiResponse`](../interfaces/JsonApiResponse.md)\>

Defined in: [packages/next-drupal/src/next-drupal.ts:669](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L669)

Fetches the JSON:API index.

#### Parameters

##### locale?

`string`

The locale for the request.

##### options?

[`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<[`JsonApiResponse`](../interfaces/JsonApiResponse.md)\>

The JSON:API index.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getIndex`](NextDrupal.md#getindex)

---

### getMenu()

> **getMenu**\<`T`\>(`menuName`, `options`?): `Promise`\<\{ `items`: `T`[]; `tree`: `T`[]; \}\>

Defined in: [packages/next-drupal/src/next-drupal.ts:773](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L773)

Fetches a menu by its name.

#### Type Parameters

• **T** = [`DrupalMenuItem`](../interfaces/DrupalMenuItem.md)

#### Parameters

##### menuName

`string`

The name of the menu.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithCacheOptions`](../type-aliases/JsonApiWithCacheOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<\{ `items`: `T`[]; `tree`: `T`[]; \}\>

The fetched menu.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getMenu`](NextDrupal.md#getmenu)

---

### getPathFromContext()

> **getPathFromContext**(`context`, `options`?): `string`

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:260](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L260)

Gets the path from the context.

#### Parameters

##### context

`GetStaticPropsContext`

The static props context.

##### options?

Options for the request.

###### pathPrefix

`string`

#### Returns

`string`

The constructed path.

---

### getResource()

> **getResource**\<`T`\>(`type`, `uuid`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:294](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L294)

Fetches a resource of the specified type by its UUID.

#### Type Parameters

• **T** _extends_ [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### type

`string`

The type of the resource.

##### uuid

`string`

The UUID of the resource.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithCacheOptions`](../type-aliases/JsonApiWithCacheOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched resource.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getResource`](NextDrupal.md#getresource)

---

### getResourceByPath()

> **getResourceByPath**\<`T`\>(`path`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:356](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L356)

Fetches a resource of the specified type by its path.

#### Type Parameters

• **T** _extends_ [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### path

`string`

The path of the resource.

##### options?

`object` & [`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched resource.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getResourceByPath`](NextDrupal.md#getresourcebypath)

---

### getResourceCollection()

> **getResourceCollection**\<`T`\>(`type`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:472](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L472)

Fetches a collection of resources of the specified type.

#### Type Parameters

• **T** = [`JsonApiResource`](../interfaces/JsonApiResource.md)[]

#### Parameters

##### type

`string`

The type of the resources.

##### options?

`object` & [`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched collection of resources.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getResourceCollection`](NextDrupal.md#getresourcecollection)

---

### getResourceCollectionFromContext()

> **getResourceCollectionFromContext**\<`T`\>(`type`, `context`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:187](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L187)

Gets a collection of resources from the context.

#### Type Parameters

• **T** = [`JsonApiResource`](../interfaces/JsonApiResource.md)[]

#### Parameters

##### type

`string`

The type of the resources.

##### context

`GetStaticPropsContext`

The static props context.

##### options?

`object` & [`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched collection of resources.

---

### getResourceCollectionPathSegments()

> **getResourceCollectionPathSegments**(`types`, `options`?): `Promise`\<`object`[]\>

Defined in: [packages/next-drupal/src/next-drupal.ts:516](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L516)

Fetches path segments for a collection of resources of the specified types.

#### Parameters

##### types

The types of the resources.

`string` | `string`[]

##### options?

`object` & [`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md) & JsonApiWithNextFetchOptions & (\{ locales: string\[\]; defaultLocale: string; \} \| \{ locales?: undefined; defaultLocale?: never; \})

Options for the request.

#### Returns

`Promise`\<`object`[]\>

The fetched path segments.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getResourceCollectionPathSegments`](NextDrupal.md#getresourcecollectionpathsegments)

---

### getResourceFromContext()

> **getResourceFromContext**\<`T`\>(`input`, `context`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:96](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L96)

Gets a resource from the context.

#### Type Parameters

• **T** _extends_ [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### input

The input path or translated path.

`string` | [`DrupalTranslatedPath`](../interfaces/DrupalTranslatedPath.md)

##### context

`GetStaticPropsContext`

The static props context.

##### options?

`object` & [`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched resource.

---

### getSearchIndex()

> **getSearchIndex**\<`T`\>(`name`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:893](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L893)

Fetches a search index by its name.

#### Type Parameters

• **T** = [`JsonApiResource`](../interfaces/JsonApiResource.md)[]

#### Parameters

##### name

`string`

The name of the search index.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched search index.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getSearchIndex`](NextDrupal.md#getsearchindex)

---

### getSearchIndexFromContext()

> **getSearchIndexFromContext**\<`T`\>(`name`, `context`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:215](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L215)

Gets a search index from the context.

#### Type Parameters

• **T** = [`JsonApiResource`](../interfaces/JsonApiResource.md)[]

#### Parameters

##### name

`string`

The name of the search index.

##### context

`GetStaticPropsContext`

The static props context.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The fetched search index.

---

### getStaticPathsFromContext()

> **getStaticPathsFromContext**(`types`, `context`, `options`?): `Promise`\<(`string` \| \{ `locale`: `string`; `params`: \{ `slug`: `string`[]; \}; \})[]\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:283](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L283)

Gets static paths from the context.

#### Parameters

##### types

The types of the resources.

`string` | `string`[]

##### context

`GetStaticPathsContext`

The static paths context.

##### options?

`object` & [`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md)

Options for the request.

#### Returns

`Promise`\<(`string` \| \{ `locale`: `string`; `params`: \{ `slug`: `string`[]; \}; \})[]\>

The fetched static paths.

---

### getView()

> **getView**\<`T`\>(`name`, `options`?): `Promise`\<[`DrupalView`](../interfaces/DrupalView.md)\<`T`\>\>

Defined in: [packages/next-drupal/src/next-drupal.ts:845](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L845)

Fetches a view by its name.

#### Type Parameters

• **T** = [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### name

`string`

The name of the view.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<[`DrupalView`](../interfaces/DrupalView.md)\<`T`\>\>

The fetched view.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`getView`](NextDrupal.md#getview)

---

### logOrThrowError()

> **logOrThrowError**(`error`): `void`

Defined in: [packages/next-drupal/src/next-drupal.ts:945](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L945)

Logs or throws an error based on the throwJsonApiErrors flag.

#### Parameters

##### error

`Error`

The error to log or throw.

#### Returns

`void`

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`logOrThrowError`](NextDrupal.md#logorthrowerror)

---

### preview()

> **preview**(`request`, `response`, `options`?): `Promise`\<`void` \| `NextApiResponse`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:423](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L423)

Handles preview mode.

#### Parameters

##### request

`NextApiRequest`

The API request.

##### response

`NextApiResponse`

The API response.

##### options?

Options for the request.

###### enable

`boolean`

#### Returns

`Promise`\<`void` \| `NextApiResponse`\>

---

### previewDisable()

> **previewDisable**(`request`, `response`): `Promise`\<`void`\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:498](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L498)

Disables preview mode.

#### Parameters

##### request

`NextApiRequest`

The API request.

##### response

`NextApiResponse`

The API response.

#### Returns

`Promise`\<`void`\>

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`throwIfJsonErrors`](NextDrupal.md#throwifjsonerrors)

---

### translatePath()

> **translatePath**(`path`, `options`?): `Promise`\<[`DrupalTranslatedPath`](../interfaces/DrupalTranslatedPath.md)\>

Defined in: [packages/next-drupal/src/next-drupal.ts:631](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L631)

Translates a path to a DrupalTranslatedPath object.

#### Parameters

##### path

`string`

The path to translate.

##### options?

[`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md) & [`JsonApiWithNextFetchOptions`](../type-aliases/JsonApiWithNextFetchOptions.md)

Options for the request.

#### Returns

`Promise`\<[`DrupalTranslatedPath`](../interfaces/DrupalTranslatedPath.md)\>

The translated path.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`translatePath`](NextDrupal.md#translatepath)

---

### translatePathFromContext()

> **translatePathFromContext**(`context`, `options`?): `Promise`\<[`DrupalTranslatedPath`](../interfaces/DrupalTranslatedPath.md)\>

Defined in: [packages/next-drupal/src/next-drupal-pages.ts:234](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal-pages.ts#L234)

Translates a path from the context.

#### Parameters

##### context

`GetStaticPropsContext`

The static props context.

##### options?

`object` & [`JsonApiWithAuthOption`](../type-aliases/JsonApiWithAuthOption.md)

Options for the request.

#### Returns

`Promise`\<[`DrupalTranslatedPath`](../interfaces/DrupalTranslatedPath.md)\>

The translated path.

---

### updateResource()

> **updateResource**\<`T`\>(`type`, `uuid`, `body`, `options`?): `Promise`\<`T`\>

Defined in: [packages/next-drupal/src/next-drupal.ts:202](https://github.com/chapter-three/next-drupal/blob/e9ce3be1c38aebdcd2cc8c7ae8d8fa2dab7f46bf/packages/next-drupal/src/next-drupal.ts#L202)

Updates an existing resource of the specified type.

#### Type Parameters

• **T** _extends_ [`JsonApiResource`](../interfaces/JsonApiResource.md)

#### Parameters

##### type

`string`

The type of the resource.

##### uuid

`string`

The UUID of the resource.

##### body

[`JsonApiUpdateResourceBody`](../interfaces/JsonApiUpdateResourceBody.md)

The body of the resource.

##### options?

[`JsonApiOptions`](../type-aliases/JsonApiOptions.md)

Options for the request.

#### Returns

`Promise`\<`T`\>

The updated resource.

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`updateResource`](NextDrupal.md#updateresource)

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

#### Inherited from

[`NextDrupal`](NextDrupal.md).[`validateDraftUrl`](NextDrupal.md#validatedrafturl)
