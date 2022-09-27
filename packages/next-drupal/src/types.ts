export type DrupalClientOptions = {
  /**
   * Set the JSON:API prefix.
   *
   * * **Default value**: `/jsonapi`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#apiprefix)
   */
  apiPrefix?: string

  /**
   * Set debug to true to enable debug messages.
   *
   * * **Default value**: `false`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#debug)
   */
  debug?: boolean

  /**
   * Set the default frontPage.
   *
   * * **Default value**: `/home`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#frontpage)
   */
  frontPage?: string

  /**
   * Set custom headers for the fetcher.
   *
   * * **Default value**: { "Content-Type": "application/vnd.api+json", Accept: "application/vnd.api+json" }
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#headers)
   */
  headers?: HeadersInit

  /**
   * Override the default data serializer. You can use this to add your own JSON:API data deserializer.
   *
   * * **Default value**: `jsona`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#serializer)
   */
  serializer?: Serializer
  /**
   * Override the default fetcher. Use this to add your own fetcher ex. axios.
   *
   * * **Default value**: `fetch`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#fetcher)
   */
  fetcher?: Fetcher

  /**
   * Override the default cache.
   *
   * * **Default value**: `node-cache`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#cache)
   */
  cache?: DataCache

  /**
   * If set to true, JSON:API errors are thrown in non-production environments. The errors are shown in the Next.js overlay.
   *
   * **Default value**: `true`
   * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#throwjsonapierrors)
   */
  throwJsonApiErrors?: boolean

  /**
   * Override the default logger. You can use this to send logs to a third-party service.
   *
   * * **Default value**: `console`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#logger)
   */
  logger?: Logger

  /**
   * Override the default auth. You can use this to implement your own authentication mechanism.
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#auth)
   */
  auth?: DrupalClientAuth

  /**
   * Set whether the client should use authenticated requests by default.
   *
   * * **Default value**: `true`
   * * **Required**: **No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#withauth)
   */
  withAuth?: boolean

  /**
   * By default, the client will make a request to JSON:API to retrieve the index. You can turn this off and use the default entry point from the resource name.
   *
   * * **Default value**: `false`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#auth)
   */
  useDefaultResourceTypeEntry?: boolean

  /**
   * The secret to use for preview mode.
   *
   * * **Default value**: `null`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#previewsecret)
   */
  previewSecret?: string

  /**
   * A long-lived access token you can set for the client.
   *
   * * **Default value**: `null`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#accesstoken)
   */
  accessToken?: AccessToken

  /**
   * The scope used for the current access token.
   */
  accessTokenScope?: string

  /**
   * If set to true, the preview cookie will be set with SameSite=None,Secure.
   *
   * * **Default value**: `false`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#forceiframesamesitecookie)
   */
  forceIframeSameSiteCookie?: boolean
}

export type DrupalClientAuth =
  | DrupalClientAuthClientIdSecret
  | DrupalClientAuthUsernamePassword
  | DrupalClientAuthAccessToken
  | (() => string)
  | string

export interface DrupalClientAuthUsernamePassword {
  username: string
  password: string
}

export interface DrupalClientAuthClientIdSecret {
  clientId: string
  clientSecret: string
  url?: string
  scope?: string
}

export type DrupalClientAuthAccessToken = AccessToken

export interface Logger {
  log(message): void

  debug(message): void

  warn(message): void

  error(message): void
}

/**
 * The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
 *
 * **Required**: *yes*
 *
 * @example
 *
 * https://example.com
 */
export type BaseUrl = string

export type Locale = string

export type PathPrefix = string

export type JsonApiOptions = {
  deserialize?: boolean
  params?: JsonApiParams
}

export type JsonApiWithLocaleOptions = JsonApiOptions &
  (
    | {
        locale: Locale
        defaultLocale: Locale
      }
    | {
        locale?: undefined
        defaultLocale?: never
      }
  )

export type JsonApiWithAuthOptions = {
  withAuth?: boolean | DrupalClientAuth
}

export type JsonApiWithCacheOptions = {
  withCache?: boolean
  cacheKey?: string
}

// TODO: Properly type this.
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type JsonApiParams = Record<string, any>

// https://jsonapi.org/format/#error-objects
export interface JsonApiError {
  id?: string
  status?: string
  code?: string
  title?: string
  detail?: string
  links?: JsonApiLinks
}

// https://jsonapi.org/format/#document-links
export interface JsonApiLinks {
  [key: string]: string | Record<string, string>
}

// TODO: any...ugh.
export interface JsonApiResponse extends Record<string, any> {
  jsonapi?: {
    version: string
    meta: Record<string, any>[]
  }
  data: Record<string, any>[]
  errors: JsonApiError[]
  meta: {
    count: number
    [key: string]: any
  }
  links?: JsonApiLinks
  included?: Record<string, any>[]
}

export interface JsonApiResourceBodyRelationship {
  data: {
    type: string
    id: string
  }
}

export interface JsonApiCreateResourceBody {
  data: {
    type?: string
    attributes?: Record<string, any>
    relationships?: Record<string, JsonApiResourceBodyRelationship>
  }
}

export interface JsonApiCreateFileResourceBody {
  data: {
    type?: string
    attributes: {
      type: string
      field: string
      filename: string
      file: Buffer
    }
  }
}

export interface JsonApiUpdateResourceBody {
  data: {
    type?: string
    id?: string
    attributes?: Record<string, any>
    relationships?: Record<string, JsonApiResourceBodyRelationship>
  }
}

export interface JsonApiSearchApiResponse extends JsonApiResponse {
  meta: JsonApiResponse["meta"] & {
    facets?: DrupalSearchApiFacet[]
  }
}

export interface Serializer {
  deserialize(
    body: Record<string, unknown>,
    options?: Record<string, unknown>
  ): unknown
}

export type Fetcher = WindowOrWorkerGlobalScope["fetch"]

export interface DataCache {
  get(key): Promise<unknown>

  set(key, value, ttl?: number): Promise<unknown>

  del?(keys): Promise<unknown>
}

export interface FetchOptions extends RequestInit {
  withAuth?: boolean | DrupalClientAuth
}

export interface DrupalSearchApiFacet {
  id: string
  label?: string
  path?: string
  terms?: {
    url: string
    values: {
      value: string
      label: string
      active?: boolean
      count?: number
    }
  }[]
}

export interface DrupalTranslatedPath {
  resolved: string
  isHomePath: boolean
  entity: {
    canonical: string
    type: string
    bundle: string
    id: string
    uuid: string
    langcode?: string
    path?: string
  }
  label?: string
  jsonapi?: {
    individual: string
    resourceName: string
    pathPrefix: string
    basePath: string
    entryPoint: string
  }
  meta?: Record<string, unknown>
  redirect?: {
    from: string
    to: string
    status: string
  }[]
}

export interface DrupalMenuLinkContent {
  description: string
  enabled: boolean
  expanded: boolean
  id: string
  menu_name: string
  meta: Record<string, unknown>
  options: Record<string, unknown>
  parent: string
  provider: string
  route: {
    name: string
    parameters: Record<string, unknown>
  }
  title: string
  type: string
  url: string
  weight: string
  items?: DrupalMenuLinkContent[]
}

export type AccessToken = {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token?: string
}

export type PathAlias = {
  alias: string
  pid: number
  langcode: string
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface JsonApiResource extends Record<string, any> {
  id: string
  type: string
  langcode: string
  status: boolean
}

export interface JsonApiResourceWithPath extends JsonApiResource {
  path: PathAlias
}

export interface PreviewOptions {
  errorMessages?: {
    secret?: string
    slug?: string
  }
}

export type GetResourcePreviewUrlOptions = JsonApiWithLocaleOptions & {
  isVersionable?: boolean
}

export interface DrupalNode extends JsonApiResourceWithPath {
  drupal_internal__nid: number
  drupal_internal__vid: number
  changed: string
  created: string
  title: string
  default_langcode: boolean
  sticky: boolean
}

export interface DrupalParagraph extends JsonApiResource {
  drupal_internal__id: number
  drupal_internal__revision_id: number
}

export interface DrupalBlock extends JsonApiResource {
  info: string
}

export interface DrupalMedia extends JsonApiResource {
  drupal_internal__mid: string
  drupal_internal__vid: string
  changed: string
  created: string
  name: string
}

export interface DrupalFile extends JsonApiResource {
  drupal_internal__fid: string
  changed: string
  created: string
  filename: string
  uri: {
    value: string
    url: string
  }
  filesize: number
  filemime: string
  resourceIdObjMeta?: DrupalFileMeta
}

export interface DrupalFileMeta {
  alt?: string
  title?: string
  width: number
  height: number
}

export interface DrupalTaxonomyTerm extends JsonApiResourceWithPath {
  drupal_internal__tid: string
  changed: string
  default_langcode: boolean
  name: string
  description: string
  weight: number
}

export interface DrupalUser extends JsonApiResourceWithPath {
  drupal_internal__uid: string
  changed: string
  created: string
  default_langcode: boolean
  name: string
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface DrupalView<T = Record<string, any>[]> {
  id: string
  results: T
  meta: JsonApiResponse["meta"]
  links: JsonApiResponse["links"]
}
