import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from "next"
import { stringify } from "qs"
import NodeCache from "node-cache"
import Jsona from "jsona"

import type {
  JsonApiResource,
  Locale,
  AccessToken,
  JsonApiResponse,
  JsonApiWithLocaleOptions,
  JsonApiParams,
  DrupalTranslatedPath,
  DrupalMenuLinkContent,
  JsonApiOptions,
  FetchOptions,
  DrupalClientOptions,
  BaseUrl,
  JsonApiWithAuthOptions,
} from "./types"
import { logger as defaultLogger } from "./logger"

// const CACHE_KEY = "NEXT_DRUPAL_ACCESS_TOKEN"

const DEFAULT_API_PREFIX = "/jsonapi"
const DEFAULT_FRONT_PAGE = "/home"

// From simple_oauth.
const DEFAULT_AUTH_URL = "/oauth/token"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  Accept: "application/vnd.api+json",
}

export class Unstable_DrupalClient {
  baseUrl: BaseUrl

  debug: DrupalClientOptions["debug"]

  frontPage: DrupalClientOptions["frontPage"]

  private formatter: DrupalClientOptions["formatter"]

  private cache: DrupalClientOptions["cache"]

  private logger: DrupalClientOptions["logger"]

  private fetcher?: DrupalClientOptions["fetcher"]

  private _headers?: DrupalClientOptions["headers"]

  private _auth?: DrupalClientOptions["auth"]

  private _apiPrefix: DrupalClientOptions["apiPrefix"]

  private useDefaultResourceTypeEntry?: DrupalClientOptions["useDefaultResourceTypeEntry"]

  private _token?: AccessToken

  private tokenExpiresOn?: number

  /**
   *
   * @param {BaseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {DrupalClientOptions} options Options for the client.
   */
  constructor(baseUrl: BaseUrl, options: DrupalClientOptions = {}) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new Error("Error: The 'baseUrl' param is required.")
    }

    const {
      apiPrefix = DEFAULT_API_PREFIX,
      formatter: dataFormatter = new Jsona(),
      cache = new NodeCache(),
      debug = false,
      frontPage = DEFAULT_FRONT_PAGE,
      useDefaultResourceTypeEntry = false,
      headers = DEFAULT_HEADERS,
      logger = defaultLogger,
      fetcher,
      auth,
    } = options

    this.baseUrl = baseUrl
    this.apiPrefix = apiPrefix
    this.formatter = dataFormatter
    this.frontPage = frontPage
    this.cache = cache
    this.debug = debug
    this.useDefaultResourceTypeEntry = useDefaultResourceTypeEntry
    this.fetcher = fetcher
    this.auth = auth
    this.headers = headers
    this.logger = logger

    this._debug("Debug mode is on.")
  }

  set apiPrefix(apiPrefix: DrupalClientOptions["apiPrefix"]) {
    this._apiPrefix = apiPrefix.charAt(0) === "/" ? apiPrefix : `/${apiPrefix}`
  }

  get apiPrefix() {
    return this._apiPrefix
  }

  set auth(auth: DrupalClientOptions["auth"]) {
    if (typeof auth === "object") {
      if (!auth.clientId || !auth.clientSecret) {
        throw new Error(
          `Error: 'clientId' and 'clientSecret' are required for 'auth'`
        )
      }

      auth = {
        url: DEFAULT_AUTH_URL,
        ...auth,
      }
    }

    this._auth = auth
  }

  set headers(value: DrupalClientOptions["headers"]) {
    this._headers = value
  }

  private set token(token: AccessToken) {
    this._token = token
    this.tokenExpiresOn = Date.now() + token.expires_in * 1000
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async fetch(input: RequestInfo, init?: FetchOptions): Promise<Response> {
    init = {
      ...init,
      headers: {
        ...this._headers,
        ...init?.headers,
      },
    }

    if (init?.withAuth) {
      this._debug(`Using authenticated request.`)

      // If a custom auth is provided, use that.
      if (typeof this._auth === "function") {
        this._debug(`Using custom auth.`)

        init["headers"]["Authorization"] = this._auth()
      } else {
        // Otherwise use the built-in client_credentials grant.
        this._debug(`Using default auth (client_credentials).`)

        // Fetch an access token and add it to the request.
        // Access token can be fetched from cache or using a custom auth method.
        const token = await this.getAccessToken()
        if (token) {
          init["headers"]["Authorization"] = `Bearer ${token.access_token}`
        }
      }
    }

    if (this.fetcher) {
      this._debug(`Using custom fetcher.`)

      return await this.fetcher(input, init)
    }

    this._debug(`Using default fetch (polyfilled by Next.js).`)

    const response = await fetch(input, init)

    this._debug({ response })

    if (response.ok) {
      return response
    }

    const message = await this.formatErrorResponse(response)

    throw new Error(message)
  }

  async getResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    options?: JsonApiWithLocaleOptions & JsonApiWithAuthOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      params: {},
      ...options,
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale ? options.locale : undefined
    )

    const url = this.buildUrl(`${apiPath}/${uuid}`, options?.params)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceByPath<T extends JsonApiResource>(
    path: string,
    options?: {
      isVersionable?: boolean
    } & JsonApiWithLocaleOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      isVersionable: false,
      params: {},
      ...options,
    }

    if (!path) {
      return null
    }

    if (
      options.locale &&
      options.defaultLocale &&
      path.indexOf(options.locale) !== 1
    ) {
      path = path === "/" ? path : path.replace(/^\/+/, "")
      path = this.getPathFromContext({
        params: { slug: [path] },
        locale: options.locale,
        defaultLocale: options.defaultLocale,
      })
    }

    const { resourceVersion = "rel:latest-version", ...params } = options.params

    if (options.isVersionable) {
      params.resourceVersion = resourceVersion
    }

    const resourceParams = stringify(params)

    const payload = [
      {
        requestId: "router",
        action: "view",
        uri: `/router/translate-path?path=${path}&_format=json`,
        headers: { Accept: "application/vnd.api+json" },
      },
      {
        requestId: "resolvedResource",
        action: "view",
        uri: `{{router.body@$.jsonapi.individual}}?${resourceParams.toString()}`,
        waitFor: ["router"],
      },
    ]

    // Localized subrequests.
    // I was hoping we would not need this but it seems like subrequests is not properly
    // setting the jsonapi locale from a translated path.
    let subrequestsPath = "/subrequests"
    if (
      options.locale &&
      options.defaultLocale &&
      options.locale !== options.defaultLocale
    ) {
      subrequestsPath = `/${options.locale}/subrequests`
    }

    const url = this.buildUrl(subrequestsPath, {
      _format: "json",
    })

    const response = await this.fetch(url.toString(), {
      method: "POST",
      credentials: "include",
      redirect: "follow",
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const json = await response.json()

    if (!json["resolvedResource#uri{0}"]) {
      return null
    }

    const data = JSON.parse(json["resolvedResource#uri{0}"]?.body)

    if (data.errors) {
      throw new Error(data.errors[0].detail)
    }

    return options.deserialize ? this.deserialize(data) : data
  }

  async getResourceFromContext<T extends JsonApiResource>(
    type: string,
    context: GetStaticPropsContext,
    options?: {
      prefix?: string
      deserialize?: boolean
      params?: JsonApiParams
      isVersionable?: boolean
    }
  ): Promise<T> {
    options = {
      deserialize: true,
      // Add support for revisions for node by default.
      // TODO: Make this required before stable?
      isVersionable: /^node--/.test(type),
      ...options,
    }

    const path = this.getPathFromContext(context, options?.prefix)

    const previewData = context.previewData as { resourceVersion?: string }

    const resource = await this.getResourceByPath<T>(path, {
      deserialize: options.deserialize,
      isVersionable: options.isVersionable,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      params: {
        resourceVersion: previewData?.resourceVersion,
        ...options?.params,
      },
    })

    // If no locale is passed, skip entity if not default_langcode.
    // This happens because decoupled_router will still translate the path
    // to a resource.
    // TODO: Figure out if we want this behavior.
    // For now this causes a bug where a non-i18n sites builds (ISR) pages for
    // localized pages.
    if (!context.locale && !resource?.default_langcode) {
      return null
    }

    return resource
  }

  async getResourceCollection<T = JsonApiResource[]>(
    type: string,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      ...options,
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale ? options.locale : undefined
    )

    const url = this.buildUrl(apiPath, {
      ...options?.params,
    })

    const response = await this.fetch(url.toString())

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceCollectionFromContext<T = JsonApiResource[]>(
    type: string,
    context: GetStaticPropsContext,
    options?: JsonApiOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      ...options,
    }

    return await this.getResourceCollection<T>(type, {
      ...options,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
    })
  }

  async getPathsFromContext(
    types: string | string[],
    context: GetStaticPathsContext,
    options: {
      params?: JsonApiParams
    } = {}
  ): Promise<GetStaticPathsResult["paths"]> {
    if (typeof types === "string") {
      types = [types]
    }

    const paths = await Promise.all(
      types.map(async (type) => {
        // Use sparse fieldset to expand max size.
        options.params = {
          [`fields[${type}]`]: "path",
          ...options?.params,
        }

        // Handle localized path aliases
        if (!context.locales?.length) {
          const resources = await this.getResourceCollection(type, {
            deserialize: true,
            ...options,
          })

          return this.buildPathsFromResources(resources)
        }

        const paths = await Promise.all(
          context.locales.map(async (locale) => {
            const resources = await this.getResourceCollection(type, {
              deserialize: true,
              locale,
              defaultLocale: context.defaultLocale,
              ...options,
            })

            return this.buildPathsFromResources(resources, locale)
          })
        )

        return paths.flat()
      })
    )

    return paths.flat()
  }

  buildPathsFromResources(resources, locale?: Locale) {
    return resources?.flatMap((resource) => {
      const slug =
        resource?.path?.alias === this.frontPage ? "/" : resource?.path?.alias

      const path = {
        params: {
          slug: `${slug?.replace(/^\/|\/$/g, "")}`.split("/"),
        },
      }

      if (locale) {
        path["locale"] = locale
      }

      return path
    })
  }

  async translatePath(path: string): Promise<DrupalTranslatedPath> {
    const url = this.buildUrl("/router/translate-path", {
      path,
    })

    const response = await this.fetch(url.toString())

    if (!response.ok) {
      return null
    }

    const json = await response.json()

    return json
  }

  async translatePathFromContext(
    context: GetStaticPropsContext,
    options?: {
      prefix?: string
    }
  ): Promise<DrupalTranslatedPath> {
    options = {
      prefix: "",
      ...options,
    }
    const path = this.getPathFromContext(context, options.prefix)

    const response = await this.translatePath(path)

    return response
  }

  getPathFromContext(context: GetStaticPropsContext, prefix = "") {
    let { slug } = context.params

    slug = Array.isArray(slug) ? slug.join("/") : slug

    // Handle locale.
    if (context.locale && context.locale !== context.defaultLocale) {
      slug = `/${context.locale}/${slug}`
    }

    if (!slug) {
      return this.frontPage
    }

    return prefix ? `${prefix}/${slug}` : slug
  }

  async getIndex(locale?: Locale): Promise<JsonApiResponse> {
    const url = this.buildUrl(
      locale ? `/${locale}${this.apiPrefix}` : this.apiPrefix
    )

    try {
      // As per https://www.drupal.org/node/2984034 /jsonapi is public.
      // We only call buildHeaders if locale is explicitly set.
      const response = await this.fetch(url.toString(), {
        // withAuth: !!locale,
      })

      return await response.json()
    } catch (error) {
      throw new Error(
        `Error: Failed to fetch JSON:API index at ${url.toString()}`
      )
    }
  }

  async getEntryForResourceType(
    type: string,
    locale?: Locale
  ): Promise<string> {
    if (this.useDefaultResourceTypeEntry) {
      const [id, bundle] = type.split("--")
      return (
        `${this.baseUrl}${this.apiPrefix}/` +
        (locale ? `${locale}/${id}/${bundle}` : `${id}/${bundle}`)
      )
    }

    const index = await this.getIndex(locale)

    const link = index?.links[type] as { href: string }

    if (!link) {
      throw new Error(`Error: Resource of type ${type} not found.`)
    }

    return link.href
  }

  async getMenu(
    name: string,
    options?: JsonApiWithLocaleOptions
  ): Promise<{
    items: DrupalMenuLinkContent[]
    tree: DrupalMenuLinkContent[]
  }> {
    options = {
      deserialize: true,
      ...options,
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const url = this.buildUrl(`${localePrefix}/jsonapi/menu_items/${name}`)

    const response = await this.fetch(url.toString())

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()

    const items = options.deserialize ? this.deserialize(data) : data

    const { items: tree } = this.buildMenuTree(items)

    return {
      items,
      tree,
    }
  }

  buildMenuTree(
    links: DrupalMenuLinkContent[],
    parent: DrupalMenuLinkContent["id"] = ""
  ) {
    const children = links.filter((link) => link.parent === parent)

    return children.length
      ? {
          items: children.map((link) => ({
            ...link,
            ...this.buildMenuTree(links, link.id),
          })),
        }
      : {}
  }

  async getView<T>(
    name: string,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions
  ): Promise<{
    results: T
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    meta: Record<string, any>
    links: {
      [key in "next" | "prev" | "self"]?: {
        href: "string"
      }
    }
  }> {
    options = {
      deserialize: true,
      ...options,
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const [viewId, displayId] = name.split("--")

    const url = this.buildUrl(
      `${localePrefix}/jsonapi/views/${viewId}/${displayId}`,
      options.params
    )

    const response = await this.fetch(url.toString())

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()

    const results = options.deserialize ? this.deserialize(data) : data

    return {
      results,
      meta: data.meta,
      links: data.links,
    }
  }

  async getSearchIndex<T = JsonApiResource[]>(
    name: string,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      ...options,
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const url = this.buildUrl(
      `${localePrefix}/jsonapi/index/${name}`,
      options.params
    )

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getSearchIndexFromContext<T = JsonApiResource[]>(
    name: string,
    context: GetStaticPropsContext,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      ...options,
    }

    return await this.getSearchIndex<T>(name, {
      ...options,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
    })
  }

  buildUrl(
    path: string,
    params?: string | Record<string, string> | URLSearchParams | JsonApiParams
  ): URL {
    const url = new URL(
      path.charAt(0) === "/" ? `${this.baseUrl}${path}` : path
    )

    if (typeof params === "object" && "getQueryObject" in params) {
      params = params.getQueryObject()
    }

    if (params) {
      // Used instead URLSearchParams for nested params.
      url.search = stringify(params)
    }

    return url
  }

  async getAccessToken(): Promise<AccessToken> {
    if (typeof this._auth !== "object") {
      return null
    }

    if (!this._auth.clientId || !this._auth.clientSecret) {
      throw new Error(`Error: 'clientId' and 'clientSecret' required.`)
    }

    if (this._token && Date.now() < this.tokenExpiresOn) {
      this._debug(`Using existing access token.`)
      return this._token
    }

    // const cached = this.cache.get<AccessToken>(CACHE_KEY)
    // if (cached?.access_token) {
    //   this._debug(`Using cached access token.`)
    //   return cached
    // }

    this._debug(`Fetching new access token.`)

    const basic = Buffer.from(
      `${this._auth.clientId}:${this._auth.clientSecret}`
    ).toString("base64")

    const response = await fetch(`${this.baseUrl}${this._auth.url}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials`,
    })

    if (!response?.ok) {
      throw new Error(response?.statusText)
    }

    const result: AccessToken = await response.json()

    this.token = result

    // this.cache.set(CACHE_KEY, result, result.expires_in)

    return result
  }

  deserialize(body, options?) {
    if (!body) return null

    return this.formatter.deserialize(body, options)
  }

  private async formatErrorResponse(response: Response) {
    let message = response.statusText

    const type = response.headers.get("content-type")

    // Construct error from response.
    // Check for type to ensure this is a JSON:API formatted error.
    // See https://jsonapi.org/format/#errors.
    if (type !== "application/vnd.api+json") {
      throw new Error(
        `Error: Invalid JSON:API response. See https://jsonapi.org/format/#errors.`
      )
    }

    const _error: JsonApiResponse = await response.json()

    if (_error?.errors?.length) {
      const [error] = _error.errors

      message = `${error.status} ${error.title}`

      if (error.detail) {
        message += `\n${error.detail}`
      }
    }

    return message
  }

  private _debug(message) {
    !!this.debug && this.logger.debug(message)
  }

  // async buildHeaders({
  //   headers = {},
  // }: {
  //   headers?: RequestInit["headers"]
  // } = {}): Promise<RequestInit["headers"]> {
  //   headers = {
  //     "Content-Type": "application/vnd.api+json",
  //   }

  //   // This allows an access_token (preferrably long-lived) to be set directly on the env.
  //   // This reduces the number of OAuth call to the Drupal server.
  //   // Intentionally marked as unstable for now.
  //   if (process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN) {
  //     headers[
  //       "Authorization"
  //     ] = `Bearer ${process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN}`

  //     return headers
  //   }

  //   const token = accessToken || (await this.getAccessToken())
  //   if (token) {
  //     headers["Authorization"] = `Bearer ${token.access_token}`
  //   }

  //   return headers
  // }
}
