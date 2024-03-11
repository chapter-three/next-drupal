import { Jsona } from "jsona"
import { stringify } from "qs"
import { NextDrupalFetch } from "./next-drupal-fetch"
import { JsonApiErrors } from "./jsonapi-errors"
import type {
  BaseUrl,
  DrupalFile,
  DrupalMenuLinkContent,
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
  JsonDeserializer,
  Locale,
  NextDrupalOptions,
  PathPrefix,
} from "./types"

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

export class NextDrupal extends NextDrupalFetch {
  cache?: NextDrupalOptions["cache"]

  deserializer: JsonDeserializer

  throwJsonApiErrors: boolean

  useDefaultResourceTypeEntry: boolean

  /**
   * Instantiates a new DrupalClient.
   *
   * const client = new DrupalClient(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for NextDrupal.
   */
  constructor(baseUrl: BaseUrl, options: NextDrupalOptions = {}) {
    super(baseUrl, options)

    const {
      cache = null,
      deserializer,
      headers,
      throwJsonApiErrors = true,
      useDefaultResourceTypeEntry = false,
    } = options

    this.cache = cache
    this.deserializer = deserializer ?? useJsonaDeserialize()
    if (!headers) {
      this.headers = DEFAULT_HEADERS
    }
    this.throwJsonApiErrors = !!throwJsonApiErrors
    this.useDefaultResourceTypeEntry = !!useDefaultResourceTypeEntry

    // Do not throw errors in production.
    if (process.env.NODE_ENV === "production") {
      this.throwJsonApiErrors = false
    }
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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

    const json = await response.json()

    /* c8 ignore next 3 */
    if (options.withCache) {
      await this.cache.set(options.cacheKey, JSON.stringify(json))
    }

    return options.deserialize ? this.deserialize(json) : json
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
      this.throwError(new Error(JsonApiErrors.formatMessage(data.errors)))
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

    await this.throwIfJsonErrors(response)

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  async getResourceCollectionPathSegments(
    types: string | string[],
    options?: {
      pathPrefix?: PathPrefix
      params?: JsonApiParams
    } & JsonApiWithAuthOption &
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

    return await response.json()
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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

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

    await this.throwIfJsonErrors(response)

    const json = await response.json()

    return options.deserialize ? this.deserialize(json) : json
  }

  deserialize(body, options?) {
    if (!body) return null

    return this.deserializer(body, options)
  }

  // Error handling.
  // If throwJsonApiErrors is enabled, we show errors in the Next.js overlay.
  // Otherwise, we log the errors even if debugging is turned off.
  // In production, errors are always logged never thrown.
  throwError(error: Error) {
    if (!this.throwJsonApiErrors) {
      this.logger.error(error)
      return
    }

    throw error
  }
}
