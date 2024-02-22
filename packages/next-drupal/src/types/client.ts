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

export type AccessToken = {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token?: string
}

export interface DataCache {
  get(key): Promise<unknown>

  set(key, value, ttl?: number): Promise<unknown>

  del?(keys): Promise<unknown>
}

export type Fetcher = WindowOrWorkerGlobalScope["fetch"]

export interface Logger {
  log(message): void

  debug(message): void

  warn(message): void

  error(message): void
}

export interface Serializer {
  deserialize(
    body: Record<string, unknown>,
    options?: Record<string, unknown>
  ): unknown
}
