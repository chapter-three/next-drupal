import { Jsona } from "jsona"
import { stringify } from "qs"
import { JsonApiErrors } from "./jsonapi-errors"
import { logger as defaultLogger } from "./logger"
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type {
  AccessToken,
  BaseUrl,
  DrupalClientAuth,
  DrupalClientAuthAccessToken,
  DrupalClientAuthClientIdSecret,
  DrupalClientAuthUsernamePassword,
  DrupalClientOptions,
  DrupalFile,
  DrupalMenuLinkContent,
  DrupalTranslatedPath,
  DrupalView,
  FetchOptions,
  JsonApiCreateFileResourceBody,
  JsonApiCreateResourceBody,
  JsonApiOptions,
  JsonApiParams,
  JsonApiResource,
  JsonApiResourceWithPath,
  JsonApiResponse,
  JsonApiUpdateResourceBody,
  JsonApiWithAuthOption,
  JsonApiWithCacheOptions,
  Locale,
  PathAlias,
  PathPrefix,
} from "./types"

const DEFAULT_API_PREFIX = "/jsonapi"
const DEFAULT_FRONT_PAGE = "/home"
const DEFAULT_WITH_AUTH = false
export const DRAFT_DATA_COOKIE_NAME = "draftData"
// See https://vercel.com/docs/workflow-collaboration/draft-mode
export const DRAFT_MODE_COOKIE_NAME = "__prerender_bypass"

// From simple_oauth.
const DEFAULT_AUTH_URL = "/oauth/token"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  Accept: "application/vnd.api+json",
}

function isBasicAuth(
  auth: DrupalClientAuth
): auth is DrupalClientAuthUsernamePassword {
  return (
    (auth as DrupalClientAuthUsernamePassword)?.username !== undefined &&
    (auth as DrupalClientAuthUsernamePassword)?.password !== undefined
  )
}

function isAccessTokenAuth(
  auth: DrupalClientAuth
): auth is DrupalClientAuthAccessToken {
  return (
    (auth as DrupalClientAuthAccessToken)?.access_token !== undefined &&
    (auth as DrupalClientAuthAccessToken)?.token_type !== undefined
  )
}

function isClientIdSecretAuth(
  auth: DrupalClientAuth
): auth is DrupalClientAuthClientIdSecret {
  return (
    (auth as DrupalClientAuthClientIdSecret)?.clientId !== undefined &&
    (auth as DrupalClientAuthClientIdSecret)?.clientSecret !== undefined
  )
}

export class DrupalClient {
  baseUrl: BaseUrl

  frontPage: DrupalClientOptions["frontPage"]

  private isDebugEnabled: DrupalClientOptions["debug"]

  private serializer: DrupalClientOptions["serializer"]

  private cache: DrupalClientOptions["cache"]

  private throwJsonApiErrors?: DrupalClientOptions["throwJsonApiErrors"]

  private logger: DrupalClientOptions["logger"]

  private fetcher?: DrupalClientOptions["fetcher"]

  private _headers?: DrupalClientOptions["headers"]

  private _auth?: DrupalClientOptions["auth"]

  private _apiPrefix: DrupalClientOptions["apiPrefix"]

  private useDefaultResourceTypeEntry?: DrupalClientOptions["useDefaultResourceTypeEntry"]

  private _token?: AccessToken

  private accessToken?: DrupalClientOptions["accessToken"]

  private accessTokenScope?: DrupalClientOptions["accessTokenScope"]

  private tokenExpiresOn?: number

  private withAuth?: DrupalClientOptions["withAuth"]

  private previewSecret?: DrupalClientOptions["previewSecret"]

  /**
   * Instantiates a new DrupalClient.
   *
   * const client = new DrupalClient(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for the client. See Experiment_DrupalClientOptions.
   */
  constructor(baseUrl: BaseUrl, options: DrupalClientOptions = {}) {
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
      throwJsonApiErrors = true,
    } = options

    this.baseUrl = baseUrl
    this.apiPrefix = apiPrefix
    this.serializer = serializer
    this.frontPage = frontPage
    this.isDebugEnabled = !!debug
    this.useDefaultResourceTypeEntry = useDefaultResourceTypeEntry
    this.fetcher = fetcher
    this.auth = auth
    this.headers = headers
    this.logger = logger
    this.withAuth = withAuth
    this.previewSecret = previewSecret
    this.cache = cache
    this.accessToken = accessToken
    this.throwJsonApiErrors = throwJsonApiErrors

    // Do not throw errors in production.
    if (process.env.NODE_ENV === "production") {
      this.throwJsonApiErrors = false
    }

    this.debug("Debug mode is on.")
  }

  set apiPrefix(apiPrefix: DrupalClientOptions["apiPrefix"]) {
    this._apiPrefix = apiPrefix.charAt(0) === "/" ? apiPrefix : `/${apiPrefix}`
  }

  get apiPrefix() {
    return this._apiPrefix
  }

  set auth(auth: DrupalClientOptions["auth"]) {
    if (typeof auth === "object") {
      const checkUsernamePassword = auth as DrupalClientAuthUsernamePassword
      const checkAccessToken = auth as DrupalClientAuthAccessToken
      const checkClientIdSecret = auth as DrupalClientAuthClientIdSecret

      if (
        checkUsernamePassword.username !== undefined ||
        checkUsernamePassword.password !== undefined
      ) {
        if (
          !checkUsernamePassword.username ||
          !checkUsernamePassword.password
        ) {
          throw new Error(
            `'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth`
          )
        }
      } else if (
        checkAccessToken.access_token !== undefined ||
        checkAccessToken.token_type !== undefined
      ) {
        if (!checkAccessToken.access_token || !checkAccessToken.token_type) {
          throw new Error(
            `'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth`
          )
        }
      } else if (
        !checkClientIdSecret.clientId ||
        !checkClientIdSecret.clientSecret
      ) {
        throw new Error(
          `'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth`
        )
      }

      this._auth = {
        ...(isClientIdSecretAuth(auth) ? { url: DEFAULT_AUTH_URL } : {}),
        ...auth,
      }
    } else {
      this._auth = auth
    }
  }

  set headers(value: DrupalClientOptions["headers"]) {
    this._headers = value
  }

  private set token(token: AccessToken) {
    this._token = token
    this.tokenExpiresOn = Date.now() + token.expires_in * 1000
  }

  async fetch(
    input: RequestInfo,
    { withAuth, ...init }: FetchOptions = {}
  ): Promise<Response> {
    init = {
      ...init,
      credentials: "include",
      headers: {
        ...this._headers,
        ...init?.headers,
      },
    }

    if (withAuth) {
      init.headers["Authorization"] = await this.getAuthorizationHeader(
        withAuth === true ? this._auth : withAuth
      )
    }

    if (this.fetcher) {
      this.debug(`Using custom fetcher, fetching: ${input}`)

      return await this.fetcher(input, init)
    }

    this.debug(`Using default fetch, fetching: ${input}`)

    return await fetch(input, init)
  }

  async getAuthorizationHeader(auth: DrupalClientAuth) {
    let header: string

    if (isBasicAuth(auth)) {
      const basic = Buffer.from(`${auth.username}:${auth.password}`).toString(
        "base64"
      )
      header = `Basic ${basic}`
      this.debug("Using basic authorization header.")
    } else if (isClientIdSecretAuth(auth)) {
      // Fetch an access token and add it to the request. getAccessToken()
      // throws an error if it fails to get an access token.
      const token = await this.getAccessToken(auth)
      header = `Bearer ${token.access_token}`
      this.debug(
        "Using access token authorization header retrieved from Client Id/Secret."
      )
    } else if (isAccessTokenAuth(auth)) {
      header = `${auth.token_type} ${auth.access_token}`
      this.debug("Using access token authorization header.")
    } else if (typeof auth === "string") {
      header = auth
      this.debug("Using custom authorization header.")
    } else if (typeof auth === "function") {
      header = auth()
      this.debug("Using custom authorization callback.")
    } else {
      throw new Error(
        "auth is not configured. See https://next-drupal.org/docs/client/auth"
      )
    }

    return header
  }

  async createResource<T extends JsonApiResource>(
    type: string,
    body: JsonApiCreateResourceBody,
    options?: JsonApiOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale
        ? /* c8 ignore next */ options.locale
        : undefined
    )

    const url = this.buildUrl(apiPath, options?.params)

    this.debug(`Creating resource of type ${type}.`)

    // Add type to body.
    body.data.type = type

    const response = await this.fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify(body),
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    return options.deserialize
      ? this.deserialize(json)
      : /* c8 ignore next */ json
  }

  async createFileResource<T = DrupalFile>(
    type: string,
    body: JsonApiCreateFileResourceBody,
    options?: JsonApiOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const hostType = body?.data?.attributes?.type

    const apiPath = await this.getEntryForResourceType(
      hostType,
      options?.locale !== options?.defaultLocale ? options.locale : undefined
    )

    const url = this.buildUrl(
      `${apiPath}/${body.data.attributes.field}`,
      options?.params
    )

    this.debug(`Creating file resource for media of type ${type}.`)

    const response = await this.fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/vnd.api+json",
        "Content-Disposition": `file; filename="${body.data.attributes.filename}"`,
      },
      body: body.data.attributes.file,
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async updateResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    body: JsonApiUpdateResourceBody,
    options?: JsonApiOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale
        ? /* c8 ignore next */ options.locale
        : undefined
    )

    const url = this.buildUrl(`${apiPath}/${uuid}`, options?.params)

    this.debug(`Updating resource of type ${type} with id ${uuid}.`)

    // Update body.
    body.data.type = type
    body.data.id = uuid

    const response = await this.fetch(url.toString(), {
      method: "PATCH",
      body: JSON.stringify(body),
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    return options.deserialize
      ? this.deserialize(json)
      : /* c8 ignore next */ json
  }

  async deleteResource(
    type: string,
    uuid: string,
    options?: JsonApiOptions
  ): Promise<boolean> {
    options = {
      withAuth: true,
      params: {},
      ...options,
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale
        ? /* c8 ignore next */ options.locale
        : undefined
    )

    const url = this.buildUrl(`${apiPath}/${uuid}`, options?.params)

    this.debug(`Deleting resource of type ${type} with id ${uuid}.`)

    const response = await this.fetch(url.toString(), {
      method: "DELETE",
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    return response.status === 204
  }

  async getResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    options?: JsonApiOptions & JsonApiWithCacheOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: this.withAuth,
      withCache: false,
      params: {},
      ...options,
    }

    /* c8 ignore next 11 */
    if (options.withCache) {
      const cached = (await this.cache.get(options.cacheKey)) as string

      if (cached) {
        this.debug(`Returning cached resource ${type} with id ${uuid}.`)

        const json = JSON.parse(cached)

        return options.deserialize ? this.deserialize(json) : json
      }
    }

    const apiPath = await this.getEntryForResourceType(
      type,
      options?.locale !== options?.defaultLocale ? options.locale : undefined
    )

    const url = this.buildUrl(`${apiPath}/${uuid}`, options?.params)

    this.debug(`Fetching resource ${type} with id ${uuid}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    /* c8 ignore next 3 */
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
    } & JsonApiOptions
  ): Promise<T> {
    const type = typeof input === "string" ? input : input.jsonapi.resourceName

    const previewData = context.previewData as {
      resourceVersion?: string
    }

    options = {
      deserialize: true,
      pathPrefix: "/",
      withAuth: this.getAuthFromContextAndOptions(context, options),
      params: {},
      ...options,
    }

    const _options = {
      deserialize: options.deserialize,
      isVersionable: options.isVersionable,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      withAuth: options?.withAuth,
      params: options?.params,
    }

    // Check if resource is versionable.
    // Add support for revisions for node by default.
    const isVersionable = options.isVersionable || /^node--/.test(type)

    // If the resource is versionable and no resourceVersion is supplied via params.
    // Use the resourceVersion from previewData or fallback to the latest version.
    if (
      isVersionable &&
      typeof options.params.resourceVersion === "undefined"
    ) {
      options.params.resourceVersion =
        previewData?.resourceVersion || "rel:latest-version"
    }

    if (typeof input !== "string") {
      // Fix for subrequests and translation.
      // TODO: Confirm if we still need this after https://www.drupal.org/i/3111456.
      // @shadcn, note to self:
      // Given an entity at /example with no translation.
      // When we try to translate /es/example, decoupled router will properly
      // translate to the untranslated version and set the locale to es.
      // However a subrequests to /es/subrequests for decoupled router will fail.
      /* c8 ignore next 3 */
      if (context.locale && input.entity.langcode !== context.locale) {
        context.locale = input.entity.langcode
      }

      // Given we already have the path info, we can skip subrequests and just make a simple
      // request to the Drupal site to get the entity.
      if (input.entity?.uuid) {
        return await this.getResource<T>(type, input.entity.uuid, _options)
      }
    }

    const path = this.getPathFromContext(context, {
      pathPrefix: options?.pathPrefix,
    })

    const resource = await this.getResourceByPath<T>(path, _options)

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
    } & JsonApiOptions
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
      path = path === "/" ? /* c8 ignore next */ path : path.replace(/^\/+/, "")
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

    this.debug(`Fetching resource by path, ${path}.`)

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
          this.throwError(new Error(error.message))
        }
      }

      return null
    }

    const data = JSON.parse(json["resolvedResource#uri{0}"]?.body)

    if (data.errors) {
      this.throwError(new Error(this.formatJsonApiErrors(data.errors)))
    }

    return options.deserialize ? this.deserialize(data) : data
  }

  async getResourceCollection<T = JsonApiResource[]>(
    type: string,
    options?: {
      deserialize?: boolean
    } & JsonApiOptions
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

    this.debug(`Fetching resource collection of type ${type}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceCollectionFromContext<T = JsonApiResource[]>(
    type: string,
    context: GetStaticPropsContext,
    options?: {
      deserialize?: boolean
    } & JsonApiOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      ...options,
    }

    return await this.getResourceCollection<T>(type, {
      ...options,
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      withAuth: this.getAuthFromContextAndOptions(context, options),
    })
  }

  getPathsFromContext = this.getStaticPathsFromContext

  async getStaticPathsFromContext(
    types: string | string[],
    context: GetStaticPathsContext,
    options?: {
      params?: JsonApiParams
      pathPrefix?: PathPrefix
    } & JsonApiWithAuthOption
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
    options?: JsonApiWithAuthOption
  ): Promise<DrupalTranslatedPath | null> {
    options = {
      withAuth: this.withAuth,
      ...options,
    }

    const url = this.buildUrl("/router/translate-path", {
      path,
    })

    this.debug(`Fetching translated path, ${path}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    if (!response?.ok) {
      // Do not throw errors here.
      // Otherwise next.js will catch error and throw a 500.
      // We want a 404.
      return null
    }

    const json = await response.json()

    return json
  }

  async translatePathFromContext(
    context: GetStaticPropsContext,
    options?: {
      pathPrefix?: PathPrefix
    } & JsonApiWithAuthOption
  ): Promise<DrupalTranslatedPath | null> {
    options = {
      pathPrefix: "/",
      ...options,
    }
    const path = this.getPathFromContext(context, {
      pathPrefix: options.pathPrefix,
    })

    return await this.translatePath(path, {
      withAuth: this.getAuthFromContextAndOptions(context, options),
    })
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

    slug = Array.isArray(slug)
      ? slug.map((s) => encodeURIComponent(s)).join("/")
      : slug

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
      this.debug(`Fetching JSON:API index.`)

      const response = await this.fetch(url.toString(), {
        // As per https://www.drupal.org/node/2984034 /jsonapi is public.
        withAuth: false,
      })

      return await response.json()
    } catch (error) {
      this.throwError(
        new Error(
          `Failed to fetch JSON:API index at ${url.toString()} - ${
            error.message
          }`
        )
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
        `${this.baseUrl}` +
        (locale ? `/${locale}${this.apiPrefix}/` : `${this.apiPrefix}/`) +
        `${id}/${bundle}`
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

      /* c8 ignore next 3 */
      if (!new RegExp(pattern, "i").test(path)) {
        return `${this.baseUrl}/${locale}${path}`
      }
    }

    return href
  }

  async validateDraftUrl(searchParams: URLSearchParams): Promise<Response> {
    const slug = searchParams.get("slug")

    this.debug(`Fetching draft url validation for ${slug}.`)

    // Fetch the headless CMS to check if the provided `slug` exists
    let response: Response
    try {
      // Validate the draft url.
      const validateUrl = this.buildUrl("/next/draft-url").toString()
      response = await this.fetch(validateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(searchParams.entries())),
      })
    } catch (error) {
      response = new Response(JSON.stringify({ message: error.message }), {
        status: 401,
      })
    }

    this.debug(
      response.status !== 200
        ? `Could not validate slug, ${slug}`
        : `Validated slug, ${slug}`
    )

    return response
  }

  async preview(
    request: NextApiRequest,
    response: NextApiResponse,
    options?: Parameters<NextApiResponse["setDraftMode"]>[0]
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, resourceVersion, plugin, secret, scope, ...draftData } =
      request.query
    const useDraftMode = options?.enable

    try {
      // Always clear preview data to handle different scopes.
      response.clearPreviewData()

      // Validate the preview url.
      const result = await this.validateDraftUrl(
        new URL(request.url, `http://${request.headers.host}`).searchParams
      )

      const validationPayload = await result.json()
      const previewData = {
        resourceVersion,
        plugin,
        ...validationPayload,
      }

      if (!result.ok) {
        this.debug(`Draft url validation error: ${validationPayload.message}`)
        response.statusCode = result.status
        return response.json(validationPayload)
      }

      // Optionally turn on draft mode.
      if (useDraftMode) {
        response.setDraftMode(options)
      }

      // Turns on preview mode and adds preview data to Next.js' static context.
      response.setPreviewData(previewData)

      // Fix issue with cookie.
      // See https://github.com/vercel/next.js/discussions/32238.
      // See https://github.com/vercel/next.js/blob/d895a50abbc8f91726daa2d7ebc22c58f58aabbb/packages/next/server/api-utils/node.ts#L504.
      const cookies = (response.getHeader("Set-Cookie") as string[]).map(
        (cookie) => cookie.replace("SameSite=Lax", "SameSite=None; Secure")
      )
      if (useDraftMode) {
        // Adds preview data for use in app router pages.
        cookies.push(
          `${DRAFT_DATA_COOKIE_NAME}=${encodeURIComponent(
            JSON.stringify({ slug, resourceVersion, ...draftData })
          )}; Path=/; HttpOnly; SameSite=None; Secure`
        )
      }
      response.setHeader("Set-Cookie", cookies)

      // We can safely redirect to the slug since this has been validated on the
      // server.
      response.writeHead(307, { Location: slug })

      this.debug(`${useDraftMode ? "Draft" : "Preview"} mode enabled.`)

      return response.end()
    } catch (error) {
      this.debug(`Preview failed: ${error.message}`)
      return response.status(422).end()
    }
  }

  async previewDisable(request: NextApiRequest, response: NextApiResponse) {
    // Disable both preview and draft modes.
    response.clearPreviewData()
    response.setDraftMode({ enable: false })

    // Delete the draft data cookie.
    const cookies = response.getHeader("Set-Cookie") as string[]
    cookies.push(
      `${DRAFT_DATA_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=None; Secure`
    )
    response.setHeader("Set-Cookie", cookies)

    response.writeHead(307, { Location: "/" })
    response.end()
  }

  async getMenu<T = DrupalMenuLinkContent>(
    name: string,
    options?: JsonApiOptions & JsonApiWithCacheOptions
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

    /* c8 ignore next 9 */
    if (options.withCache) {
      const cached = (await this.cache.get(options.cacheKey)) as string

      if (cached) {
        this.debug(`Returning cached menu items for ${name}.`)
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

    this.debug(`Fetching menu items for ${name}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const data = await response.json()

    const items = options.deserialize
      ? this.deserialize(data)
      : /* c8 ignore next */ data

    const { items: tree } = this.buildMenuTree(items)

    const menu = {
      items,
      tree,
    }

    /* c8 ignore next 3 */
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

  async getView<T = JsonApiResource>(
    name: string,
    options?: JsonApiOptions
  ): Promise<DrupalView<T>> {
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

    this.debug(`Fetching view, ${viewId}.${displayId}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

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
    options?: JsonApiOptions
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

    this.debug(`Fetching search index, ${name}.`)

    const response = await this.fetch(url.toString(), {
      withAuth: options.withAuth,
    })

    await this.throwIfJsonApiErrors(response)

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getSearchIndexFromContext<T = JsonApiResource[]>(
    name: string,
    context: GetStaticPropsContext,
    options?: JsonApiOptions
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

  async getAccessToken(
    opts?: DrupalClientAuthClientIdSecret
  ): Promise<AccessToken> {
    if (this.accessToken && this.accessTokenScope === opts?.scope) {
      return this.accessToken
    }

    let auth: DrupalClientAuthClientIdSecret
    if (isClientIdSecretAuth(opts)) {
      auth = {
        url: DEFAULT_AUTH_URL,
        ...opts,
      }
    } else if (isClientIdSecretAuth(this._auth)) {
      auth = this._auth
    } else if (typeof this._auth === "undefined") {
      throw new Error(
        "auth is not configured. See https://next-drupal.org/docs/client/auth"
      )
    } else {
      throw new Error(
        `'clientId' and 'clientSecret' required. See https://next-drupal.org/docs/client/auth`
      )
    }

    const url = this.buildUrl(auth.url)

    if (
      this.accessTokenScope === opts?.scope &&
      this._token &&
      Date.now() < this.tokenExpiresOn
    ) {
      this.debug(`Using existing access token.`)
      return this._token
    }

    this.debug(`Fetching new access token.`)

    // Use BasicAuth to retrieve the access token.
    const credentials: DrupalClientAuthUsernamePassword = {
      username: auth.clientId,
      password: auth.clientSecret,
    }
    let body = `grant_type=client_credentials`

    if (opts?.scope) {
      body = `${body}&scope=${opts.scope}`

      this.debug(`Using scope: ${opts.scope}`)
    }

    const response = await this.fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: await this.getAuthorizationHeader(credentials),
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    await this.throwIfJsonApiErrors(response)

    const result: AccessToken = await response.json()

    this.token = result

    this.accessTokenScope = opts?.scope

    return result
  }

  deserialize(body, options?) {
    if (!body) return null

    return this.serializer.deserialize(body, options)
  }

  private async getErrorsFromResponse(response: Response) {
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
        return _error.errors
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

  debug(message) {
    this.isDebugEnabled && this.logger.debug(message)
  }

  // Error handling.
  // If throwErrors is enabled, we show errors in the Next.js overlay.
  // Otherwise, we log the errors even if debugging is turned off.
  // In production, errors are always logged never thrown.
  private throwError(error: Error) {
    if (!this.throwJsonApiErrors) {
      return this.logger.error(error)
    }

    throw error
  }

  private async throwIfJsonApiErrors(response: Response) {
    if (!response?.ok) {
      const errors = await this.getErrorsFromResponse(response)
      throw new JsonApiErrors(errors, response.status)
    }
  }

  private getAuthFromContextAndOptions(
    context: GetStaticPropsContext,
    options: JsonApiWithAuthOption
  ) {
    // If not in preview or withAuth is provided, use that.
    if (!context.preview) {
      // If we have provided an auth, use that.
      if (typeof options?.withAuth !== "undefined") {
        return options.withAuth
      }

      // Otherwise we fallback to the global auth.
      return this.withAuth
    }

    // If no plugin is provided, return.
    const plugin = context.previewData?.["plugin"]
    if (!plugin) {
      return null
    }

    let withAuth = this._auth

    if (plugin === "simple_oauth") {
      // If we are using a client id and secret auth, pass the scope.
      if (isClientIdSecretAuth(withAuth) && context.previewData?.["scope"]) {
        withAuth = {
          ...withAuth,
          scope: context.previewData?.["scope"],
        }
      }
    }

    if (plugin === "jwt") {
      const accessToken = context.previewData?.["access_token"]

      if (accessToken) {
        return `Bearer ${accessToken}`
      }
    }

    return withAuth
  }
}
