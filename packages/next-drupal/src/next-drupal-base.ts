import { stringify } from "qs"
import { JsonApiErrors } from "./jsonapi-errors"
import { logger as defaultLogger } from "./logger"
import type {
  AccessToken,
  BaseUrl,
  EndpointSearchParams,
  FetchOptions,
  JsonApiResponse,
  Locale,
  Logger,
  NextDrupalAuth,
  NextDrupalAuthAccessToken,
  NextDrupalAuthClientIdSecret,
  NextDrupalAuthUsernamePassword,
  NextDrupalBaseOptions,
  PathPrefix,
} from "./types"

const DEFAULT_API_PREFIX = ""
const DEFAULT_FRONT_PAGE = "/home"
const DEFAULT_WITH_AUTH = false

// From simple_oauth.
const DEFAULT_AUTH_URL = "/oauth/token"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export class NextDrupalBase {
  accessToken?: NextDrupalBaseOptions["accessToken"]

  baseUrl: BaseUrl

  fetcher?: NextDrupalBaseOptions["fetcher"]

  frontPage: string

  isDebugEnabled: boolean

  logger: Logger

  withAuth: boolean

  private _apiPrefix: string

  private _auth?: NextDrupalAuth

  private _headers: Headers

  private _token?: AccessToken

  private _tokenExpiresOn?: number

  private _tokenRequestDetails?: NextDrupalAuthClientIdSecret

  /**
   * Instantiates a new NextDrupalBase.
   *
   * const client = new NextDrupalBase(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for NextDrupalBase.
   */
  constructor(baseUrl: BaseUrl, options: NextDrupalBaseOptions = {}) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new Error("The 'baseUrl' param is required.")
    }

    const {
      accessToken,
      apiPrefix = DEFAULT_API_PREFIX,
      auth,
      debug = false,
      fetcher,
      frontPage = DEFAULT_FRONT_PAGE,
      headers = DEFAULT_HEADERS,
      logger = defaultLogger,
      withAuth = DEFAULT_WITH_AUTH,
    } = options

    this.accessToken = accessToken
    this.apiPrefix = apiPrefix
    this.auth = auth
    this.baseUrl = baseUrl
    this.fetcher = fetcher
    this.frontPage = frontPage
    this.isDebugEnabled = !!debug
    this.headers = headers
    this.logger = logger
    this.withAuth = withAuth

    this.debug("Debug mode is on.")
  }

  set apiPrefix(apiPrefix: string) {
    this._apiPrefix =
      apiPrefix === "" || apiPrefix.startsWith("/")
        ? apiPrefix
        : `/${apiPrefix}`
  }

  get apiPrefix() {
    return this._apiPrefix
  }

  set auth(auth: NextDrupalAuth) {
    if (typeof auth === "object") {
      const checkUsernamePassword = auth as NextDrupalAuthUsernamePassword
      const checkAccessToken = auth as NextDrupalAuthAccessToken
      const checkClientIdSecret = auth as NextDrupalAuthClientIdSecret

      if (
        checkUsernamePassword.username !== undefined ||
        checkUsernamePassword.password !== undefined
      ) {
        if (
          !checkUsernamePassword.username ||
          !checkUsernamePassword.password
        ) {
          throw new Error(
            "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
          )
        }
      } else if (
        checkAccessToken.access_token !== undefined ||
        checkAccessToken.token_type !== undefined
      ) {
        if (!checkAccessToken.access_token || !checkAccessToken.token_type) {
          throw new Error(
            "'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth"
          )
        }
      } else if (
        !checkClientIdSecret.clientId ||
        !checkClientIdSecret.clientSecret
      ) {
        throw new Error(
          "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
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

  get auth() {
    return this._auth
  }

  set headers(headers: HeadersInit) {
    this._headers = new Headers(headers)
  }

  get headers() {
    return this._headers
  }

  set token(token: AccessToken) {
    this._token = token
    this._tokenExpiresOn = Date.now() + token.expires_in * 1000
  }

  get token() {
    return this._token
  }

  async fetch(
    input: RequestInfo,
    { withAuth, ...init }: FetchOptions = {}
  ): Promise<Response> {
    init.credentials = "include"

    // Merge the init.headers with this.headers
    const headers = new Headers(this.headers)
    if (init?.headers) {
      const initHeaders = new Headers(init?.headers)
      for (const key of initHeaders.keys()) {
        headers.set(key, initHeaders.get(key))
      }
    }

    // Set Authorization header.
    if (withAuth) {
      headers.set(
        "Authorization",
        await this.getAuthorizationHeader(
          withAuth === true ? this.auth : withAuth
        )
      )
    }

    init.headers = headers

    if (typeof input === "string" && input.startsWith("/")) {
      input = `${this.baseUrl}${input}`
    }

    if (this.fetcher) {
      this.debug(`Using custom fetcher, fetching: ${input}`)

      return await this.fetcher(input, init)
    }

    this.debug(`Using default fetch, fetching: ${input}`)

    return await fetch(input, init)
  }

  async getAuthorizationHeader(auth: NextDrupalAuth) {
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

  buildUrl(path: string, searchParams?: EndpointSearchParams): URL {
    const url = new URL(path, this.baseUrl)

    const search =
      // Handle DrupalJsonApiParams objects.
      searchParams &&
      typeof searchParams === "object" &&
      "getQueryObject" in searchParams
        ? searchParams.getQueryObject()
        : searchParams

    if (search) {
      // Use stringify instead of URLSearchParams for nested params.
      url.search = stringify(search)
    }

    return url
  }

  // async so subclasses can query for endpoint discovery.
  async buildEndpoint({
    locale = "",
    path = "",
    searchParams,
  }: {
    locale?: string
    path?: string
    searchParams?: EndpointSearchParams
  } = {}): Promise<string> {
    const localeSegment = locale ? `/${locale}` : ""

    if (path && !path.startsWith("/")) {
      path = `/${path}`
    }

    return this.buildUrl(
      `${localeSegment}${this.apiPrefix}${path}`,
      searchParams
    ).toString()
  }

  constructPathFromSegment(
    segment: string | string[],
    options: {
      locale?: Locale
      defaultLocale?: Locale
      pathPrefix?: PathPrefix
    } = {}
  ) {
    let { pathPrefix = "" } = options
    const { locale, defaultLocale } = options

    // Ensure pathPrefix starts with a "/" and does not end with a "/".
    if (pathPrefix) {
      if (!pathPrefix?.startsWith("/")) {
        pathPrefix = `/${options.pathPrefix}`
      }
      if (pathPrefix.endsWith("/")) {
        pathPrefix = pathPrefix.slice(0, -1)
      }
    }

    // If the segment is given as an array of segments, join the parts.
    if (!Array.isArray(segment)) {
      segment = segment ? [segment] : []
    }
    segment = segment.map((part) => encodeURIComponent(part)).join("/")

    if (!segment && !pathPrefix) {
      // If no pathPrefix is given and the segment is empty, then the path
      // should be the homepage.
      segment = this.frontPage
    }

    // Ensure the segment starts with a "/" and does not end with a "/".
    if (segment && !segment.startsWith("/")) {
      segment = `/${segment}`
    }
    if (segment.endsWith("/")) {
      segment = segment.slice(0, -1)
    }

    return this.addLocalePrefix(`${pathPrefix}${segment}`, {
      locale,
      defaultLocale,
    })
  }

  addLocalePrefix(
    path: string,
    options: { locale?: Locale; defaultLocale?: Locale } = {}
  ) {
    const { locale, defaultLocale } = options

    if (!path.startsWith("/")) {
      path = `/${path}`
    }

    let localePrefix = ""
    if (locale && !path.startsWith(`/${locale}`) && locale !== defaultLocale) {
      localePrefix = `/${locale}`
    }

    return `${localePrefix}${path}`
  }

  async getAccessToken(
    clientIdSecret?: NextDrupalAuthClientIdSecret
  ): Promise<AccessToken> {
    if (this.accessToken) {
      return this.accessToken
    }

    let auth: NextDrupalAuthClientIdSecret
    if (isClientIdSecretAuth(clientIdSecret)) {
      auth = {
        url: DEFAULT_AUTH_URL,
        ...clientIdSecret,
      }
    } else if (isClientIdSecretAuth(this.auth)) {
      auth = { ...this.auth }
    } else if (typeof this.auth === "undefined") {
      throw new Error(
        "auth is not configured. See https://next-drupal.org/docs/client/auth"
      )
    } else {
      throw new Error(
        `'clientId' and 'clientSecret' required. See https://next-drupal.org/docs/client/auth`
      )
    }

    const url = this.buildUrl(auth.url)

    // Ensure that the unexpired token was using the same scope and client
    // credentials as the current request before re-using it.
    if (
      this.token &&
      Date.now() < this._tokenExpiresOn &&
      this._tokenRequestDetails?.clientId === auth?.clientId &&
      this._tokenRequestDetails?.clientSecret === auth?.clientSecret &&
      this._tokenRequestDetails?.scope === auth?.scope
    ) {
      this.debug(`Using existing access token.`)
      return this.token
    }

    this.debug(`Fetching new access token.`)

    // Use BasicAuth to retrieve the access token.
    const clientCredentials: NextDrupalAuthUsernamePassword = {
      username: auth.clientId,
      password: auth.clientSecret,
    }
    const body = new URLSearchParams({ grant_type: "client_credentials" })

    if (auth?.scope) {
      body.set("scope", auth.scope)

      this.debug(`Using scope: ${auth.scope}`)
    }

    const response = await this.fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: await this.getAuthorizationHeader(clientCredentials),
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    await this.throwIfJsonErrors(
      response,
      "Error while fetching new access token: "
    )

    const result: AccessToken = await response.json()

    this.token = result

    this._tokenRequestDetails = auth

    return result
  }

  async validateDraftUrl(searchParams: URLSearchParams): Promise<Response> {
    const path = searchParams.get("path")

    this.debug(`Fetching draft url validation for ${path}.`)

    // Fetch the headless CMS to check if the provided `path` exists
    let response: Response
    try {
      // Validate the draft url.
      const validateUrl = this.buildUrl("/next/draft-url").toString()
      response = await this.fetch(validateUrl, {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
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
        ? `Could not validate path, ${path}`
        : `Validated path, ${path}`
    )

    return response
  }

  debug(message) {
    this.isDebugEnabled && this.logger.debug(message)
  }

  async throwIfJsonErrors(response: Response, messagePrefix = "") {
    if (!response?.ok) {
      const errors = await this.getErrorsFromResponse(response)
      throw new JsonApiErrors(errors, response.status, messagePrefix)
    }
  }

  async getErrorsFromResponse(response: Response) {
    const type = response.headers.get("content-type")
    let error: JsonApiResponse | { message: string }

    if (type === "application/json") {
      error = await response.json()

      if (error?.message) {
        return error.message as string
      }
    }

    // Construct error from response.
    // Check for type to ensure this is a JSON:API formatted error.
    // See https://jsonapi.org/format/#errors.
    else if (type === "application/vnd.api+json") {
      error = (await response.json()) as JsonApiResponse

      if (error?.errors?.length) {
        return error.errors
      }
    }

    return response.statusText
  }
}

export function isBasicAuth(
  auth: NextDrupalAuth
): auth is NextDrupalAuthUsernamePassword {
  return (
    (auth as NextDrupalAuthUsernamePassword)?.username !== undefined &&
    (auth as NextDrupalAuthUsernamePassword)?.password !== undefined
  )
}

export function isAccessTokenAuth(
  auth: NextDrupalAuth
): auth is NextDrupalAuthAccessToken {
  return (
    (auth as NextDrupalAuthAccessToken)?.access_token !== undefined &&
    (auth as NextDrupalAuthAccessToken)?.token_type !== undefined
  )
}

export function isClientIdSecretAuth(
  auth: NextDrupalAuth
): auth is NextDrupalAuthClientIdSecret {
  return (
    (auth as NextDrupalAuthClientIdSecret)?.clientId !== undefined &&
    (auth as NextDrupalAuthClientIdSecret)?.clientSecret !== undefined
  )
}
