import { Jsona } from "jsona"
import { stringify } from "qs"
import { JsonApiErrors } from "./jsonapi-errors"
import { DrupalMenuTree } from "./menu-tree"
import { NextDrupalBase } from "./next-drupal-base"
import type {
  BaseUrl,
  DrupalFile,
  DrupalMenuItem,
  DrupalTranslatedPath,
  DrupalView,
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
  JsonApiWithNextFetchOptions,
  JsonDeserializer,
  Locale,
  NextDrupalOptions,
  PathPrefix,
} from "./types"

const DEFAULT_API_PREFIX = "/jsonapi"

// See https://jsonapi.org/format/#content-negotiation.
const DEFAULT_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  Accept: "application/vnd.api+json",
}

export function useJsonaDeserialize() {
  const jsonFormatter = new Jsona()
  return function jsonaDeserialize(
    body: Parameters<JsonDeserializer>[0],
    options: Parameters<JsonDeserializer>[1]
  ) {
    return jsonFormatter.deserialize(body, options)
  }
}

/**
 * The NextDrupal class extends the NextDrupalBase class and provides methods
 * for interacting with a Drupal backend.
 */
export class NextDrupal extends NextDrupalBase {
  cache?: NextDrupalOptions["cache"]

  deserializer: JsonDeserializer

  throwJsonApiErrors: boolean

  useDefaultEndpoints: boolean

  /**
   * Instantiates a new NextDrupal.
   *
   * const client = new NextDrupal(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for NextDrupal.
   */
  constructor(baseUrl: BaseUrl, options: NextDrupalOptions = {}) {
    super(baseUrl, options)

    const {
      apiPrefix = DEFAULT_API_PREFIX,
      cache = null,
      deserializer,
      headers = DEFAULT_HEADERS,
      throwJsonApiErrors = true,
      useDefaultEndpoints = true,
    } = options

    this.apiPrefix = apiPrefix
    this.cache = cache
    this.deserializer = deserializer ?? useJsonaDeserialize()
    this.headers = headers
    this.throwJsonApiErrors = !!throwJsonApiErrors
    this.useDefaultEndpoints = !!useDefaultEndpoints

    // Do not throw errors in production.
    if (process.env.NODE_ENV === "production") {
      this.throwJsonApiErrors = false
    }
  }

  /**
   * Creates a new resource of the specified type.
   *
   * @param {string} type The type of the resource.
   * @param {JsonApiCreateResourceBody} body The body of the resource.
   * @param {JsonApiOptions} options Options for the request.
   * @returns {Promise<T>} The created resource.
   */
  async createResource<T extends JsonApiResource>(
    type: string,
    body: JsonApiCreateResourceBody,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale
          ? /* c8 ignore next */ options.locale
          : undefined,
      resourceType: type,
      searchParams: options?.params,
    })

    this.debug(`Creating resource of type ${type}.`)

    // Add type to body.
    body.data.type = type

    const response = await this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      withAuth: options.withAuth,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while creating resource: ")

    const json = await response.json()

    return options.deserialize
      ? this.deserialize(json)
      : /* c8 ignore next */ json
  }

  /**
   * Creates a new file resource for the specified media type.
   *
   * @param {string} type The type of the media.
   * @param {JsonApiCreateFileResourceBody} body The body of the file resource.
   * @param {JsonApiOptions} options Options for the request.
   * @returns {Promise<T>} The created file resource.
   */
  async createFileResource<T = DrupalFile>(
    type: string,
    body: JsonApiCreateFileResourceBody,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const resourceType = body?.data?.attributes?.type

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      resourceType,
      path: `/${body.data.attributes.field}`,
      searchParams: options?.params,
    })

    this.debug(`Creating file resource for media of type ${type}.`)

    const response = await this.fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/vnd.api+json",
        "Content-Disposition": `file; filename="${body.data.attributes.filename}"`,
      },
      body: body.data.attributes.file,
      withAuth: options.withAuth,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(
      response,
      "Error while creating file resource: "
    )

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  /**
   * Updates an existing resource of the specified type.
   *
   * @param {string} type The type of the resource.
   * @param {string} uuid The UUID of the resource.
   * @param {JsonApiUpdateResourceBody} body The body of the resource.
   * @param {JsonApiOptions} options Options for the request.
   * @returns {Promise<T>} The updated resource.
   */
  async updateResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    body: JsonApiUpdateResourceBody,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<T> {
    options = {
      deserialize: true,
      withAuth: true,
      ...options,
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale
          ? /* c8 ignore next */ options.locale
          : undefined,
      resourceType: type,
      path: `/${uuid}`,
      searchParams: options?.params,
    })

    this.debug(`Updating resource of type ${type} with id ${uuid}.`)

    // Update body.
    body.data.type = type
    body.data.id = uuid

    const response = await this.fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      withAuth: options.withAuth,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while updating resource: ")

    const json = await response.json()

    return options.deserialize
      ? this.deserialize(json)
      : /* c8 ignore next */ json
  }

  /**
   * Deletes an existing resource of the specified type.
   *
   * @param {string} type The type of the resource.
   * @param {string} uuid The UUID of the resource.
   * @param {JsonApiOptions} options Options for the request.
   * @returns {Promise<boolean>} True if the resource was deleted, false otherwise.
   */
  async deleteResource(
    type: string,
    uuid: string,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<boolean> {
    options = {
      withAuth: true,
      params: {},
      ...options,
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale
          ? /* c8 ignore next */ options.locale
          : undefined,
      resourceType: type,
      path: `/${uuid}`,
      searchParams: options?.params,
    })

    this.debug(`Deleting resource of type ${type} with id ${uuid}.`)

    const response = await this.fetch(endpoint, {
      method: "DELETE",
      withAuth: options.withAuth,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while deleting resource: ")

    return response.status === 204
  }

  /**
   * Fetches a resource of the specified type by its UUID.
   *
   * @param {string} type The resource type. Example: `node--article`, `taxonomy_term--tags`, or `block_content--basic`.
   * @param {string} uuid The id of the resource. Example: `15486935-24bf-4be7-b858-a5b2de78d09d`.
   * @param {JsonApiOptions & JsonApiWithCacheOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<T>} The fetched resource.
   * @examples
   * Get a page by uuid.
   * ```ts
   * const node = await drupal.getResource(
   *  "node--page",
   *  "07464e9f-9221-4a4f-b7f2-01389408e6c8"
   * )
   * ```
   * Get the es translation for a page by uuid.
   * ```ts
   * const node = await drupal.getResource(
   *   "node--page",
   *   "07464e9f-9221-4a4f-b7f2-01389408e6c8",
   *   {
   *     locale: "es",
   *     defaultLocale: "en",
   *   }
   * )
   * ```
   * Get the raw JSON:API response.
   * ```ts
   * const { data, meta, links } = await drupal.getResource(
   *   "node--page",
   *   "07464e9f-9221-4a4f-b7f2-01389408e6c8",
   *   {
   *     deserialize: false,
   *   }
   * )
   * ```
   * Get a node--article resource using cache.
   * ```ts
   * const id = "07464e9f-9221-4a4f-b7f2-01389408e6c8"
   *
   * const article = await drupal.getResource("node--article", id, {
   *   withCache: true,
   *   cacheKey: `node--article:${id}`,
   * })
   * ```
   * Get a page resource with time-based revalidation.
   * ```ts
   * const node = await drupal.getResource(
   *   "node--page",
   *   "07464e9f-9221-4a4f-b7f2-01389408e6c8",
   *   { next: { revalidate: 3600 } }
   * )
   * ```
   * Get a page resource with tag-based revalidation.
   * ```ts
   * const {slug} = params;
   * const path = drupal.translatePath(slug)
   *
   * const type = path.jsonapi.resourceName
   * const tag = `${path.entity.type}:${path.entity.id}`
   *
   * const node = await drupal.getResource(path, path.entity.uuid, {
   *   params: params.getQueryObject(),
   *   tags: [tag]
   * })
   * ```
   * Using DrupalNode for a node entity type.
   * ```ts
   * import { DrupalNode } from "next-drupal"
   *
   * const node = await drupal.getResource<DrupalNode>(
   *   "node--page",
   *   "07464e9f-9221-4a4f-b7f2-01389408e6c8"
   * )
   * ```
   * Using DrupalTaxonomyTerm for a taxonomy term entity type.
   * ```ts
   * import { DrupalTaxonomyTerm } from "next-drupal"
   *
   * const term = await drupal.getResource<DrupalTaxonomyTerm>(
   *   "taxonomy_term--tags",
   *   "7b47d7cc-9b1b-4867-a909-75dc1d61dfd3"
   * )
   * ```
   */
  async getResource<T extends JsonApiResource>(
    type: string,
    uuid: string,
    options?: JsonApiOptions &
      JsonApiWithCacheOptions &
      JsonApiWithNextFetchOptions
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

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      resourceType: type,
      path: `/${uuid}`,
      searchParams: options?.params,
    })

    this.debug(`Fetching resource ${type} with id ${uuid}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while fetching resource: ")

    const json = await response.json()

    /* c8 ignore next 3 */
    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(json))
    }

    return options.deserialize ? this.deserialize(json) : json
  }

  /**
   * Fetches a resource of the specified type by its path.
   *
   * @param {string} path The path of the resource.
   * @param {JsonApiOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<T>} The fetched resource.
   */
  async getResourceByPath<T extends JsonApiResource>(
    path: string,
    options?: {
      isVersionable?: boolean
    } & JsonApiOptions &
      JsonApiWithNextFetchOptions
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

    path = this.addLocalePrefix(path, {
      locale: options.locale,
      defaultLocale: options.defaultLocale,
    })

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

    // Handle localized subrequests. It seems like subrequests is not properly
    // setting the jsonapi locale from a translated path.
    // TODO: Confirm we still need this after https://www.drupal.org/i/3111456
    const subrequestsEndpoint = this.addLocalePrefix("/subrequests", {
      locale: options.locale,
      defaultLocale: options.defaultLocale,
    })

    const endpoint = this.buildUrl(subrequestsEndpoint, {
      _format: "json",
    }).toString()

    this.debug(`Fetching resource by path, ${path}.`)

    const response = await this.fetch(endpoint, {
      method: "POST",
      credentials: "include",
      redirect: "follow",
      body: JSON.stringify(payload),
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    const errorMessagePrefix = "Error while fetching resource by path:"

    if (response.status !== 207) {
      const errors = await this.getErrorsFromResponse(response)
      throw new JsonApiErrors(errors, response.status, errorMessagePrefix)
    }

    const json = await response.json()

    if (!json?.["resolvedResource#uri{0}"]?.body) {
      const status = json?.router?.headers?.status?.[0]
      if (status === 404) {
        return null
      }
      const message =
        (json?.router?.body && JSON.parse(json.router.body)?.message) ||
        "Unknown error"
      throw new JsonApiErrors(message, status, errorMessagePrefix)
    }

    const data = JSON.parse(json["resolvedResource#uri{0}"]?.body)

    if (data.errors) {
      const status = json?.["resolvedResource#uri{0}"]?.headers?.status?.[0]
      this.logOrThrowError(
        new JsonApiErrors(data.errors, status, errorMessagePrefix)
      )
    }

    return options.deserialize ? this.deserialize(data) : data
  }

  /**
   * Fetches a collection of resources of the specified type.
   *
   * @param {string} type The type of the resources.
   * @param {JsonApiOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<T>} The fetched collection of resources.
   */
  async getResourceCollection<T = JsonApiResource[]>(
    type: string,
    options?: {
      deserialize?: boolean
    } & JsonApiOptions &
      JsonApiWithNextFetchOptions
  ): Promise<T> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      ...options,
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      resourceType: type,
      searchParams: options?.params,
    })

    this.debug(`Fetching resource collection of type ${type}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(
      response,
      "Error while fetching resource collection: "
    )

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  /**
   * Fetches path segments for a collection of resources of the specified types.
   *
   * @param {string | string[]} types The types of the resources.
   * @param {JsonApiOptions & JsonApiWithAuthOption & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<{ path: string, type: string, locale: Locale, segments: string[] }[]>} The fetched path segments.
   */
  async getResourceCollectionPathSegments(
    types: string | string[],
    options?: {
      pathPrefix?: PathPrefix
      params?: JsonApiParams
    } & JsonApiWithAuthOption &
      JsonApiWithNextFetchOptions &
      (
        | {
            locales: Locale[]
            defaultLocale: Locale
          }
        | {
            locales?: undefined
            defaultLocale?: never
          }
      )
  ): Promise<
    {
      path: string
      type: string
      locale: Locale
      segments: string[]
    }[]
  > {
    options = {
      withAuth: this.withAuth,
      pathPrefix: "",
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

        const locales = options?.locales?.length ? options.locales : [undefined]

        return Promise.all(
          locales.map(async (locale) => {
            let opts: Parameters<NextDrupal["getResourceCollection"]>[1] = {
              params,
              withAuth: options.withAuth,
              next: options.next,
              cache: options.cache,
            }
            if (locale) {
              opts = {
                ...opts,
                deserialize: true,
                locale,
                defaultLocale: options.defaultLocale,
              }
            }
            const resources = await this.getResourceCollection<
              JsonApiResourceWithPath[]
            >(type, opts)

            return (
              resources
                .map((resource) => {
                  return resource?.path?.alias === this.frontPage
                    ? /* c8 ignore next */ "/"
                    : resource?.path?.alias
                })
                // Remove results with no path aliases.
                .filter(Boolean)
                .map((path) => {
                  let segmentPath = path

                  // Trim the pathPrefix off the front of the path.
                  if (
                    options.pathPrefix &&
                    (segmentPath.startsWith(
                      `${options.pathPrefix}/`
                    ) /* c8 ignore next */ ||
                      segmentPath === options.pathPrefix)
                  ) {
                    segmentPath = segmentPath.slice(options.pathPrefix.length)
                  }

                  // Convert the trimmed path into an array of path segments.
                  const segments = segmentPath.split("/").filter(Boolean)

                  return {
                    path,
                    type,
                    locale,
                    segments,
                  }
                })
            )
          })
        )
      })
    )

    return paths.flat(2)
  }

  /**
   * Translates a path to a DrupalTranslatedPath object.
   *
   * @param {string} path The path to translate.
   * @param {JsonApiWithAuthOption & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<DrupalTranslatedPath | null>} The translated path.
   */
  async translatePath(
    path: string,
    options?: JsonApiWithAuthOption & JsonApiWithNextFetchOptions
  ): Promise<DrupalTranslatedPath | null> {
    options = {
      withAuth: this.withAuth,
      ...options,
    }

    const endpoint = this.buildUrl("/router/translate-path", {
      path,
    }).toString()

    this.debug(`Fetching translated path, ${path}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    if (response.status === 404) {
      // Do not throw errors here, otherwise Next.js will catch the error and
      // throw a 500. We want a 404.
      return null
    }

    await this.throwIfJsonErrors(response)

    return await response.json()
  }

  /**
   * Fetches the JSON:API index.
   *
   * @param {Locale} locale The locale for the request.
   * @param {JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<JsonApiResponse>} The JSON:API index.
   */
  async getIndex(
    locale?: Locale,
    options?: JsonApiWithNextFetchOptions
  ): Promise<JsonApiResponse> {
    const endpoint = await this.buildEndpoint({
      locale,
    })

    this.debug(`Fetching JSON:API index.`)

    const response = await this.fetch(endpoint, {
      // As per https://www.drupal.org/node/2984034 /jsonapi is public.
      withAuth: false,
      next: options?.next,
      cache: options?.cache,
    })

    await this.throwIfJsonErrors(
      response,
      `Failed to fetch JSON:API index at ${endpoint}: `
    )

    return await response.json()
  }

  /**
   * Builds an endpoint URL for the specified parameters.
   *
   * @param {Parameters<NextDrupalBase["buildEndpoint"]>[0] & { resourceType?: string }} params The parameters for the endpoint.
   * @returns {Promise<string>} The built endpoint URL.
   */
  async buildEndpoint({
    locale = "",
    resourceType = "",
    path = "",
    searchParams,
  }: Parameters<NextDrupalBase["buildEndpoint"]>[0] & {
    resourceType?: string
  } = {}): Promise<string> {
    let localeSegment = locale ? `/${locale}` : ""
    let apiSegment = this.apiPrefix

    // Determine the optional resource part of the endpoint URL.
    let resourceSegment = ""
    if (resourceType) {
      if (this.useDefaultEndpoints) {
        const [id, bundle] = resourceType.split("--")
        resourceSegment = `/${id}` + (bundle ? `/${bundle}` : "")
      } else {
        resourceSegment = (
          await this.fetchResourceEndpoint(resourceType, locale)
        ).pathname
        // Fetched endpoint URLs already include the apiPrefix and the locale.
        localeSegment = ""
        apiSegment = ""
      }
    }

    if (path && !path.startsWith("/")) {
      path = `/${path}`
    }

    return this.buildUrl(
      `${localeSegment}${apiSegment}${resourceSegment}${path}`,
      searchParams
    ).toString()
  }

  /**
   * Fetches the endpoint URL for the specified resource type.
   *
   * @param {string} type The type of the resource.
   * @param {Locale} locale The locale for the request.
   * @returns {Promise<URL>} The fetched endpoint URL.
   */
  async fetchResourceEndpoint(type: string, locale?: Locale): Promise<URL> {
    const index = await this.getIndex(locale)

    const link = index.links?.[type] as { href: string }

    if (!link) {
      throw new Error(`Resource of type '${type}' not found.`)
    }

    const url = new URL(link.href)

    // TODO: Is this "fix" needed any more? Drupal 9.4 and later don't exhibit
    //  this behavior.
    // Fix for missing locale in JSON:API index.
    // This fix ensures the locale is included in the resource link.
    /* c8 ignore next 3 */
    if (locale && !url.pathname.startsWith(`/${locale}`)) {
      url.pathname = `/${locale}${url.pathname}`
    }

    return url
  }

  /**
   * Fetches a menu by its name.
   *
   * @param {string} menuName The name of the menu.
   * @param {JsonApiOptions & JsonApiWithCacheOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<{ items: T[], tree: T[] }>} The fetched menu.
   */
  async getMenu<T = DrupalMenuItem>(
    menuName: string,
    options?: JsonApiOptions &
      JsonApiWithCacheOptions &
      JsonApiWithNextFetchOptions
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
        this.debug(`Returning cached menu items for ${menuName}.`)
        return JSON.parse(cached)
      }
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      resourceType: "menu_items",
      path: menuName,
      searchParams: options.params,
    })

    this.debug(`Fetching menu items for ${menuName}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while fetching menu items: ")

    const data = await response.json()

    const items = options.deserialize
      ? this.deserialize(data)
      : /* c8 ignore next */ data

    const tree = new DrupalMenuTree(items)

    const menu = {
      items,
      tree: tree.length ? tree : undefined,
    }

    /* c8 ignore next 3 */
    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(menu))
    }

    return menu
  }

  /**
   * Fetches a view by its name.
   *
   * @param {string} name The name of the view.
   * @param {JsonApiOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<DrupalView<T>>} The fetched view.
   */
  async getView<T = JsonApiResource>(
    name: string,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<DrupalView<T>> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      params: {},
      ...options,
    }

    const [viewId, displayId] = name.split("--")

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      path: `/views/${viewId}/${displayId}`,
      searchParams: options.params,
    })

    this.debug(`Fetching view, ${viewId}.${displayId}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(response, "Error while fetching view: ")

    const data = await response.json()

    const results = options.deserialize ? this.deserialize(data) : data

    return {
      id: name,
      results,
      meta: data.meta,
      links: data.links,
    }
  }

  /**
   * Fetches a search index by its name.
   *
   * @param {string} name The name of the search index.
   * @param {JsonApiOptions & JsonApiWithNextFetchOptions} options Options for the request.
   * @returns {Promise<T>} The fetched search index.
   */
  async getSearchIndex<T = JsonApiResource[]>(
    name: string,
    options?: JsonApiOptions & JsonApiWithNextFetchOptions
  ): Promise<T> {
    options = {
      withAuth: this.withAuth,
      deserialize: true,
      ...options,
    }

    const endpoint = await this.buildEndpoint({
      locale:
        options?.locale !== options?.defaultLocale ? options.locale : undefined,
      path: `/index/${name}`,
      searchParams: options.params,
    })

    this.debug(`Fetching search index, ${name}.`)

    const response = await this.fetch(endpoint, {
      withAuth: options.withAuth,
      next: options.next,
      cache: options.cache,
    })

    await this.throwIfJsonErrors(
      response,
      "Error while fetching search index: "
    )

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  /**
   * Deserializes the response body.
   *
   * @param {any} body The response body.
   * @param {any} options Options for deserialization.
   * @returns {any} The deserialized response body.
   */
  deserialize(body, options?) {
    if (!body) return null

    return this.deserializer(body, options)
  }

  /**
   * Logs or throws an error based on the throwJsonApiErrors flag.
   *
   * @param {Error} error The error to log or throw.
   */
  logOrThrowError(error: Error) {
    if (!this.throwJsonApiErrors) {
      this.logger.error(error)
      return
    }

    throw error
  }
}
