import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { stringify } from "qs"
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
  FetchOptions,
  Experiment_DrupalClientOptions,
  BaseUrl,
  JsonApiWithAuthOptions,
  PathPrefix,
  JsonApiResourceWithPath,
  PathAlias,
  PreviewOptions,
  GetResourcePreviewUrlOptions,
  JsonApiWithCacheOptions,
} from "./types"
import { logger as defaultLogger } from "./logger"

const DEFAULT_API_PREFIX = "/jsonapi"
const DEFAULT_FRONT_PAGE = "/home"
const DEFAULT_WITH_AUTH = false

// From simple_oauth.
const DEFAULT_AUTH_URL = "/oauth/token"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  Accept: "application/vnd.api+json",
}

export class Experiment_DrupalClient {
  baseUrl: BaseUrl

  debug: Experiment_DrupalClientOptions["debug"]

  frontPage: Experiment_DrupalClientOptions["frontPage"]

  private serializer: Experiment_DrupalClientOptions["serializer"]

  private cache: Experiment_DrupalClientOptions["cache"]

  private logger: Experiment_DrupalClientOptions["logger"]

  private fetcher?: Experiment_DrupalClientOptions["fetcher"]

  private _headers?: Experiment_DrupalClientOptions["headers"]

  private _auth?: Experiment_DrupalClientOptions["auth"]

  private _apiPrefix: Experiment_DrupalClientOptions["apiPrefix"]

  private useDefaultResourceTypeEntry?: Experiment_DrupalClientOptions["useDefaultResourceTypeEntry"]

  private _token?: AccessToken

  private accessToken?: Experiment_DrupalClientOptions["accessToken"]

  private tokenExpiresOn?: number

  private withAuth?: Experiment_DrupalClientOptions["withAuth"]

  private previewSecret?: Experiment_DrupalClientOptions["previewSecret"]

  private forceIframeSameSiteCookie?: Experiment_DrupalClientOptions["forceIframeSameSiteCookie"]

  /**
   * Instantiates a new Experiment_DrupalClient.
   *
   * const client = new Experiment_DrupalClient(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for the client. See Experiment_DrupalClientOptions.
   */
  constructor(baseUrl: BaseUrl, options: Experiment_DrupalClientOptions = {}) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new Error("The 'baseUrl' param is required.")
    }

    const {
      apiPrefix = DEFAULT_API_PREFIX,
      serializer = new Jsona(),
      cache = null,
      debug = false,
      frontPage = DEFAULT_FRONT_PAGE,
      useDefaultResourceTypeEntry = false,
      headers = DEFAULT_HEADERS,
      logger = defaultLogger,
      withAuth = DEFAULT_WITH_AUTH,
      fetcher,
      auth,
      previewSecret,
      accessToken,
      forceIframeSameSiteCookie = false,
    } = options

    this.baseUrl = baseUrl
    this.apiPrefix = apiPrefix
    this.serializer = serializer
    this.frontPage = frontPage
    this.debug = debug
    this.useDefaultResourceTypeEntry = useDefaultResourceTypeEntry
    this.fetcher = fetcher
    this.auth = auth
    this.headers = headers
    this.logger = logger
    this.withAuth = withAuth
    this.previewSecret = previewSecret
    this.cache = cache
    this.accessToken = accessToken
    this.forceIframeSameSiteCookie = forceIframeSameSiteCookie

    this._debug("Debug mode is on.")
  }

  set apiPrefix(apiPrefix: Experiment_DrupalClientOptions["apiPrefix"]) {
    this._apiPrefix = apiPrefix.charAt(0) === "/" ? apiPrefix : `/${apiPrefix}`
  }

  get apiPrefix() {
    return this._apiPrefix
  }

  set auth(auth: Experiment_DrupalClientOptions["auth"]) {
    if (typeof auth === "object") {
      if (!auth.clientId || !auth.clientSecret) {
        throw new Error(
          `'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth`
        )
      }

      auth = {
        url: DEFAULT_AUTH_URL,
        ...auth,
      }
    }

    this._auth = auth
  }

  set headers(value: Experiment_DrupalClientOptions["headers"]) {
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

    if (response?.ok) {
      return response
    }

    const message = await this.formatErrorResponse(response)

    // Only throw errors in development
    if (process.env.NODE_ENV !== "production") {
      throw new Error(message)
    } else {
      if (this.debug) {
        this.logger.error(message)
      }

      return null
    }
  }

  async getResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    options?: JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions &
      JsonApiWithCacheOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: this.withAuth,
      withCache: false,
      params: {},
      ...options,
    }

    if (options.withCache) {
      const cached = (await this.cache.get(options.cacheKey)) as string

      if (cached) {
        this._debug(`Returning cached resource ${type} with id ${uuid}`)

        const json = JSON.parse(cached)

        return options.deserialize ? this.deserialize(json) : json
      }
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale ? options.locale : undefined
    )

    const url = this.buildUrl(`${apiPath}/${uuid}`, options?.params)

    this._debug(`Fetching resource ${type} with id ${uuid}.`)
    this._debug(url.toString())

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const json = await response.json()

    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(json))
    }

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceFromContext<T extends JsonApiResource>(
    input: string | DrupalTranslatedPath,
    context: GetStaticPropsContext,
    options?: {
      pathPrefix?: PathPrefix
      isVersionable?: boolean
    } & JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions
  ): Promise<T> {
    const type = typeof input === "string" ? input : input.jsonapi.resourceName

    if (typeof input !== "string") {
      // Fix for subrequests and translation.
      // TODO: Confirm if we still need this after https://www.drupal.org/i/3111456.
      // @shadcn, note to self:
      // Given an entity at /example with no translation.
      // When we try to translate /es/example, decoupled router will properly
      // translate to the untranslated version and set the locale to es.
      // However a subrequests to /es/subrequests for decoupled router will fail.
      if (context.locale && input.entity.langcode !== context.locale) {
        context.locale = input.entity.langcode
      }
    }

    options = {
      // Add support for revisions for node by default.
      // TODO: Make this required before stable?
      isVersionable: /^node--/.test(type),
      deserialize: true,
      pathPrefix: "/",
      withAuth: this.withAuth,
      params: {},
      ...options,
    }

    const path = this.getPathFromContext(context, {
      pathPrefix: options?.pathPrefix,
    })

    const previewData = context.previewData as { resourceVersion?: string }

    const resource = await this.getResourceByPath<T>(path, {
      deserialize: options.deserialize,
      isVersionable: options.isVersionable,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      withAuth: context.preview || options?.withAuth,
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
    // if (!context.locale && !resource?.default_langcode) {
    //   return null
    // }

    return resource
  }

  async getResourceByPath<T extends JsonApiResource>(
    path: string,
    options?: {
      isVersionable?: boolean
    } & JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      isVersionable: false,
      withAuth: this.withAuth,
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

    // If a resourceVersion is provided, assume entity type is versionable.
    if (options.params.resourceVersion) {
      options.isVersionable = true
    }

    const { resourceVersion = "rel:latest-version", ...params } = options.params

    if (options.isVersionable) {
      params.resourceVersion = resourceVersion
    }

    const resourceParams = stringify(params)

    // We are intentionally not using translatePath here.
    // We want a single request using subrequests.
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
    // TODO: Confirm if we still need this after https://www.drupal.org/i/3111456.
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
      withAuth: options.withAuth,
    })

    const json = await response.json()

    if (!json?.["resolvedResource#uri{0}"]?.body) {
      if (json?.router?.body) {
        const error = JSON.parse(json.router.body)
        if (error?.message) {
          throw new Error(error.message)
        }
      }

      return null
    }

    const data = JSON.parse(json["resolvedResource#uri{0}"]?.body)

    if (data.errors) {
      throw new Error(this.formatJsonApiErrors(data.errors))
    }

    return options.deserialize ? this.deserialize(data) : data
  }

  async getResourceCollection<T = JsonApiResource[]>(
    type: string,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions
  ): Promise<T> {
    options = {
      withAuth: this.withAuth,
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

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceCollectionFromContext<T = JsonApiResource[]>(
    type: string,
    context: GetStaticPropsContext,
    options?: {
      deserialize?: boolean
    } & JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions
  ): Promise<T> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      ...options,
    }

    return await this.getResourceCollection<T>(type, {
      ...options,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      withAuth: context.preview || options.withAuth,
    })
  }

  getPathsFromContext = this.getStaticPathsFromContext

  async getStaticPathsFromContext(
    types: string | string[],
    context: GetStaticPathsContext,
    options?: {
      params?: JsonApiParams
      pathPrefix?: PathPrefix
    } & JsonApiWithAuthOptions
  ): Promise<GetStaticPathsResult<{ slug: string[] }>["paths"]> {
    options = {
      withAuth: this.withAuth,
      pathPrefix: "/",
      params: {},
      ...options,
    }

    if (typeof types === "string") {
      types = [types]
    }

    const paths = await Promise.all(
      types.map(async (type) => {
        // Use sparse fieldset to expand max size.
        // Note we don't need status filter here since this runs non-authenticated (by default).
        const params = {
          [`fields[${type}]`]: "path",
          ...options?.params,
        }

        // Handle localized path aliases
        if (!context.locales?.length) {
          const resources = await this.getResourceCollection<
            JsonApiResourceWithPath[]
          >(type, {
            params,
            withAuth: options.withAuth,
          })

          return this.buildStaticPathsFromResources(resources, {
            pathPrefix: options.pathPrefix,
          })
        }

        const paths = await Promise.all(
          context.locales.map(async (locale) => {
            const resources = await this.getResourceCollection<
              JsonApiResourceWithPath[]
            >(type, {
              deserialize: true,
              locale,
              defaultLocale: context.defaultLocale,
              params,
              withAuth: options.withAuth,
            })

            return this.buildStaticPathsFromResources(resources, {
              locale,
              pathPrefix: options.pathPrefix,
            })
          })
        )

        return paths.flat()
      })
    )

    return paths.flat()
  }

  buildStaticPathsFromResources(
    resources: {
      path: PathAlias
    }[],
    options?: {
      pathPrefix?: PathPrefix
      locale?: Locale
    }
  ) {
    const paths = resources
      ?.flatMap((resource) => {
        return resource?.path?.alias === this.frontPage
          ? "/"
          : resource?.path?.alias
      })
      .filter(Boolean)

    return paths?.length
      ? this.buildStaticPathsParamsFromPaths(paths, options)
      : []
  }

  buildStaticPathsParamsFromPaths(
    paths: string[],
    options?: { pathPrefix?: PathPrefix; locale?: Locale }
  ) {
    return paths.flatMap((_path) => {
      _path = _path.replace(/^\/|\/$/g, "")

      // Remove pathPrefix.
      if (options?.pathPrefix && options.pathPrefix !== "/") {
        // Remove leading slash from pathPrefix.
        const pathPrefix = options.pathPrefix.replace(/^\//, "")

        _path = _path.replace(`${pathPrefix}/`, "")
      }

      const path = {
        params: {
          slug: _path.split("/"),
        },
      }

      if (options?.locale) {
        path["locale"] = options.locale
      }

      return path
    })
  }

  async translatePath(
    path: string,
    options?: JsonApiWithAuthOptions
  ): Promise<DrupalTranslatedPath> {
    options = {
      withAuth: this.withAuth,
      ...options,
    }

    const url = this.buildUrl("/router/translate-path", {
      path,
    })

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    if (!response?.ok) {
      return null
    }

    const json = await response.json()

    return json
  }

  async translatePathFromContext(
    context: GetStaticPropsContext,
    options?: {
      pathPrefix?: PathPrefix
    } & JsonApiWithAuthOptions
  ): Promise<DrupalTranslatedPath> {
    options = {
      pathPrefix: "/",
      withAuth: this.withAuth,
      ...options,
    }
    const path = this.getPathFromContext(context, {
      pathPrefix: options.pathPrefix,
    })

    const response = await this.translatePath(path, {
      withAuth: context.preview || options.withAuth,
    })

    return response
  }

  getPathFromContext(
    context: GetStaticPropsContext,
    options?: {
      pathPrefix?: PathPrefix
    }
  ) {
    options = {
      pathPrefix: "/",
      ...options,
    }

    let slug = context.params?.slug

    let pathPrefix =
      options.pathPrefix?.charAt(0) === "/"
        ? options.pathPrefix
        : `/${options.pathPrefix}`

    // Handle locale.
    if (context.locale && context.locale !== context.defaultLocale) {
      pathPrefix = `/${context.locale}${pathPrefix}`
    }

    slug = Array.isArray(slug) ? slug.join("/") : slug

    // Handle front page.
    if (!slug) {
      slug = this.frontPage
      pathPrefix = pathPrefix.replace(/\/$/, "")
    }

    slug =
      pathPrefix.slice(-1) !== "/" && slug.charAt(0) !== "/" ? `/${slug}` : slug

    return `${pathPrefix}${slug}`
  }

  async getIndex(locale?: Locale): Promise<JsonApiResponse> {
    const url = this.buildUrl(
      locale ? `/${locale}${this.apiPrefix}` : this.apiPrefix
    )

    try {
      const response = await this.fetch(url.toString(), {
        // As per https://www.drupal.org/node/2984034 /jsonapi is public.
        withAuth: false,
      })

      return await response.json()
    } catch (error) {
      throw new Error(
        `Failed to fetch JSON:API index at ${url.toString()} - ${error.message}`
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

    const link = index.links?.[type] as { href: string }

    if (!link) {
      throw new Error(`Resource of type '${type}' not found.`)
    }

    const { href } = link

    // Fix for missing locale in JSON:API index.
    // This fix ensures the locale is included in the resouce link.
    if (locale) {
      const pattern = `^\\/${locale}\\/`
      const path = href.replace(this.baseUrl, "")

      if (!new RegExp(pattern, "i").test(path)) {
        return `${this.baseUrl}/${locale}${path}`
      }
    }

    return href
  }

  async preview(
    request?: NextApiRequest,
    response?: NextApiResponse,
    options?: PreviewOptions
  ) {
    const { slug, resourceVersion, secret, locale, defaultLocale } =
      request.query

    if (secret !== this.previewSecret) {
      return response.status(401).json({
        message: options?.errorMessages.secret || "Invalid preview secret.",
      })
    }

    if (!slug) {
      return response
        .status(401)
        .end({ message: options?.errorMessages.slug || "Invalid slug." })
    }

    let _options: GetResourcePreviewUrlOptions = {
      isVersionable: !!resourceVersion,
    }

    if (locale && defaultLocale) {
      // Fix for und locale.
      const _locale = locale === "und" ? defaultLocale : locale

      _options = {
        ..._options,
        locale: _locale as string,
        defaultLocale: defaultLocale as string,
      }
    }

    const entity = await this.getResourceByPath(slug as string, {
      withAuth: true,
      ..._options,
    })

    if (!entity || !entity?.path) {
      throw new Error(
        `The path attribute is missing for entity with slug ${slug}`
      )
    }

    const url = entity?.default_langcode
      ? entity.path.alias
      : `/${entity.path.langcode}${entity.path.alias}`

    if (!url) {
      response
        .status(404)
        .end({ message: options?.errorMessages.slug || "Invalid slug" })
    }

    response.setPreviewData({
      resourceVersion,
    })

    // Fix issue with cookie.
    // See https://github.com/vercel/next.js/discussions/32238.
    // See https://github.com/vercel/next.js/blob/d895a50abbc8f91726daa2d7ebc22c58f58aabbb/packages/next/server/api-utils/node.ts#L504.
    if (this.forceIframeSameSiteCookie) {
      const previous = response.getHeader("Set-Cookie") as string[]
      previous.forEach((cookie, index) => {
        previous[index] = cookie.replace("SameSite=Lax", "SameSite=None;Secure")
      })
      response.setHeader(`Set-Cookie`, previous)
    }

    response.writeHead(307, { Location: url })

    return response.end()
  }

  async getMenu<T extends DrupalMenuLinkContent>(
    name: string,
    options?: JsonApiWithLocaleOptions &
      JsonApiWithAuthOptions &
      JsonApiWithCacheOptions
  ): Promise<{
    items: T[]
    tree: T[]
  }> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      params: {},
      withCache: false,
      ...options,
    }

    if (options.withCache) {
      const cached = (await this.cache.get(options.cacheKey)) as string

      if (cached) {
        this._debug(`Returning cached menu items for ${name}`)
        return JSON.parse(cached)
      }
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const url = this.buildUrl(
      `${localePrefix}${this.apiPrefix}/menu_items/${name}`,
      options.params
    )

    this._debug(`Fetching menu items for ${name}.`)
    this._debug(url.toString())

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const data = await response.json()

    const items = options.deserialize ? this.deserialize(data) : data

    const { items: tree } = this.buildMenuTree(items)

    const menu = {
      items,
      tree,
    }

    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(menu))
    }

    return menu
  }

  buildMenuTree(
    links: DrupalMenuLinkContent[],
    parent: DrupalMenuLinkContent["id"] = ""
  ) {
    if (!links?.length) {
      return {
        items: [],
      }
    }

    const children = links.filter((link) => link?.parent === parent)

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
    options?: JsonApiWithLocaleOptions & JsonApiWithAuthOptions
  ): Promise<{
    id: string
    results: T
    meta: JsonApiResponse["meta"]
    links: JsonApiResponse["links"]
  }> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      params: {},
      ...options,
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const [viewId, displayId] = name.split("--")

    const url = this.buildUrl(
      `${localePrefix}${this.apiPrefix}/views/${viewId}/${displayId}`,
      options.params
    )

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const data = await response.json()

    const results = options.deserialize ? this.deserialize(data) : data

    return {
      id: name,
      results,
      meta: data.meta,
      links: data.links,
    }
  }

  async getSearchIndex<T = JsonApiResource[]>(
    name: string,
    options?: JsonApiWithLocaleOptions & JsonApiWithAuthOptions
  ): Promise<T> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      ...options,
    }

    const localePrefix =
      options?.locale && options.locale !== options.defaultLocale
        ? `/${options.locale}`
        : ""

    const url = this.buildUrl(
      `${localePrefix}${this.apiPrefix}/index/${name}`,
      options.params
    )

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getSearchIndexFromContext<T = JsonApiResource[]>(
    name: string,
    context: GetStaticPropsContext,
    options?: JsonApiWithLocaleOptions & JsonApiWithAuthOptions
  ): Promise<T> {
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
    if (this.accessToken) {
      return this.accessToken
    }

    if (typeof this._auth !== "object") {
      throw new Error(
        "auth is not configured. See https://next-drupal.org/docs/client/auth"
      )
    }

    if (!this._auth.clientId || !this._auth.clientSecret) {
      throw new Error(
        `'clientId' and 'clientSecret' required. See https://next-drupal.org/docs/client/auth`
      )
    }

    if (this._token && Date.now() < this.tokenExpiresOn) {
      this._debug(`Using existing access token.`)
      return this._token
    }

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

    this._debug(result)

    this.token = result

    return result
  }

  deserialize(body, options?) {
    if (!body) return null

    return this.serializer.deserialize(body, options)
  }

  private async formatErrorResponse(response: Response) {
    const type = response.headers.get("content-type")

    if (type === "application/json") {
      const error = await response.json()
      return error.message
    }

    // Construct error from response.
    // Check for type to ensure this is a JSON:API formatted error.
    // See https://jsonapi.org/format/#errors.
    if (type === "application/vnd.api+json") {
      const _error: JsonApiResponse = await response.json()

      if (_error?.errors?.length) {
        return this.formatJsonApiErrors(_error.errors)
      }
    }

    return response.statusText
  }

  private formatJsonApiErrors(errors) {
    const [error] = errors

    let message = `${error.status} ${error.title}`

    if (error.detail) {
      message += `\n${error.detail}`
    }

    return message
  }

  private _debug(message) {
    !!this.debug && this.logger.debug(message)
  }
}
