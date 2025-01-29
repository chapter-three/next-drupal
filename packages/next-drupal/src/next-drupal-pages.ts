import { Jsona } from "jsona"
import { DRAFT_DATA_COOKIE_NAME } from "./draft-constants"
import { DrupalMenuTree } from "./menu-tree"
import { NextDrupal } from "./next-drupal"
import { isClientIdSecretAuth } from "./next-drupal-base"
import type {
  BaseUrl,
  DrupalClientOptions,
  DrupalMenuItem,
  DrupalMenuItemId,
  DrupalPathAlias,
  DrupalTranslatedPath,
  JsonApiOptions,
  JsonApiParams,
  JsonApiResource,
  JsonApiResourceWithPath,
  JsonApiWithAuthOption,
  JsonDeserializer,
  Locale,
  PathPrefix,
} from "./types"
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"

/**
 * The NextDrupalPages class extends the NextDrupal class and provides methods
 * for interacting with a Drupal backend in the context of Next.js pages.
 */
export class NextDrupalPages extends NextDrupal {
  private serializer: DrupalClientOptions["serializer"]

  /**
   * Instantiates a new NextDrupalPages.
   *
   * const client = new NextDrupalPages(baseUrl)
   *
   * @param {baseUrl} baseUrl The baseUrl of your Drupal site. Do not add the /jsonapi suffix.
   * @param {options} options Options for the client. See Experiment_DrupalClientOptions.
   */
  constructor(baseUrl: BaseUrl, options: DrupalClientOptions = {}) {
    super(baseUrl, options)

    const {
      serializer = new Jsona(),
      useDefaultResourceTypeEntry = false,
      useDefaultEndpoints = null,
    } = options

    if (useDefaultEndpoints === null) {
      this.useDefaultEndpoints = !!useDefaultResourceTypeEntry
    }

    this.serializer = serializer

    this.deserializer = (
      body: Parameters<JsonDeserializer>[0],
      options: Parameters<JsonDeserializer>[1]
    ) => this.serializer.deserialize(body, options)
  }

  /**
   * Gets the entry point for a given resource type.
   *
   * @param {string} resourceType The resource type.
   * @param {Locale} locale The locale.
   * @returns {Promise<string>} The entry point URL.
   */
  async getEntryForResourceType(
    resourceType: string,
    locale?: Locale
  ): Promise<string> {
    return this.buildEndpoint({
      locale,
      resourceType,
    })
  }

  /* c8 ignore next 3 */
  buildMenuTree(links: DrupalMenuItem[], parent: DrupalMenuItemId = "") {
    return new DrupalMenuTree<DrupalMenuItem>(links, parent)
  }

  /**
   * Gets a resource from the context.
   *
   * @param {string | DrupalTranslatedPath} input Either a resource type (e.g. "node--article") or a translated path from translatePath().
   * @param {GetStaticPropsContext} context The Next.js context from getStaticProps.
   * @param {Object} options Options for the request.
   * @param {PathPrefix} [options.pathPrefix] The path prefix to use for the request (defaults to "/").
   * @param {boolean} [options.isVersionable] Whether the resource is versionable (defaults to false for all entity types except nodes).
   * @returns {Promise<T>} The fetched resource.
   * @remarks
   * The localized resource will be fetched based on the `locale` and `defaultLocale` values from `context`.
   *
   * If you pass in a `DrupalTranslatedPath` for input, `getResourceFromContext` will take the `type` and `id` from the path and make a `getResource` call to Drupal:
   * ```ts
   * export async function getStaticProps(context) {
   *   const path = await drupal.translatePathFromContext(context)
   *
   *   const node = await drupal.getResourceFromContext(path, context)
   *
   *   return {
   *     props: {
   *       node,
   *     },
   *   }
   * }
   * ```
   *
   * If you pass in a `string` input, such as `node--article`, `getResourceFromContext` will make a subrequest call to Drupal to translate the path and then fetch the resource.
   * You will need both the [Subrequests](https://drupal.org/project/subrequests) and [Decoupled Router](https://drupal.org/project/decoupled_router) modules:
   * ```ts
   * export async function getStaticProps(context) {
   *   const node = await drupal.getResourceFromContext("node--article", context)
   *
   *   return {
   *     props: {
   *       node,
   *     },
   *   }
   * }
   * ```
   * @examples
   * Fetch a resource from context.
   * ```ts title=pages/[[...slug]].tsx
   * export async function getStaticProps(context) {
   *   const node = await drupal.getResourceFromContext("node--page", context)
   *
   *   return {
   *     props: {
   *       node,
   *     },
   *   }
   * }
   * ```
   * Fetch a resource from context in a sub directory.
   * ```ts title=pages/articles/[[...slug]].tsx
   * export async function getStaticProps(context) {
   *   const node = await drupal.getResourceFromContext("node--page", context, {
   *     pathPrefix: "/articles",
   *   })
   *
   *   return {
   *     props: {
   *       node,
   *     },
   *   }
   * }
   * ```
   * Using DrupalNode type:
   * ```ts
   * import { DrupalNode } from "next-drupal"
   *
   * const node = await drupal.getResourceFromContext<DrupalNode>(
   *   "node--page",
   *   context
   * )
   * ```
   * Using DrupalTaxonomyTerm type:
   * ```ts
   * import { DrupalTaxonomyTerm } from "next-drupal"
   *
   * const term = await drupal.getResourceFromContext<DrupalTaxonomyTerm>(
   *   "taxonomy_term--tags",
   *   context
   * )
   * ```
   * @see {@link https://next-drupal.org/docs/typescript} for more built-in types.
   */
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

  /**
   * Gets a collection of resources from the context.
   *
   * @param {string} type The type of the resources. Example: `node--article` or `user--user`.
   * @param {GetStaticPropsContext} context The static props context from getStaticProps or getServerSideProps.
   * @param {Object} options Options for the request.
   *   - deserialize: Set to false to return the raw JSON:API response
   * @returns {Promise<T>} The fetched collection of resources.
   * @remarks
   * The localized resources will be fetched based on the `locale` and `defaultLocale` values from `context`.
   * @example
   * Get all articles from context
   * ```
   * export async function getStaticProps(context) {
   *   const articles = await drupal.getResourceCollectionFromContext(
   *     "node--article",
   *     context
   *   )
   *
   *   return {
   *     props: {
   *       articles,
   *     },
   *   }
   * }
   * ```
   * Using TypeScript with DrupalNode for a node entity type
   * ```
   * import { DrupalNode } from "next-drupal"
   * const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
   *   "node--article",
   *   context
   * )
   * ```
   */
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

  /**
   * Gets a search index from the context.
   *
   * @param {string} name The name of the search index.
   * @param {GetStaticPropsContext} context The static props context.
   * @param {Object} options Options for the request.
   * @returns {Promise<T>} The fetched search index.
   */
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

  /**
   * Translates a path from the context.
   *
   * @param {GetStaticPropsContext} context The context from `getStaticProps` or `getServerSideProps`.
   * @param {Object} options Options for the request.
   * @returns {Promise<DrupalTranslatedPath | null>} The translated path.
   * @requires Decoupled Router module
   * @example
   * Get info about a path from `getStaticProps` context
   * ```ts
   * export async function getStaticProps(context) {
   *   const path = await drupal.translatePathFromContext(context)
   * }
   * ```
   */
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

  /**
   * Gets the path from the context.
   *
   * @param {GetStaticPropsContext} context The static props context.
   * @param {Object} options Options for the request.
   * @returns {string} The constructed path.
   */
  getPathFromContext(
    context: GetStaticPropsContext,
    options?: {
      pathPrefix?: PathPrefix
    }
  ) {
    return this.constructPathFromSegment(context.params?.slug, {
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      pathPrefix: options?.pathPrefix,
    })
  }

  getPathsFromContext = this.getStaticPathsFromContext

  /**
   * Gets static paths from the context.
   *
   * @param {string | string[]} types The resource types. Example: `node--article` or `["taxonomy_term--tags", "user--user"]`.
   * @param {GetStaticPathsContext} context The context from `getStaticPaths`.
   * @param {object} options Options for the request.
   * @returns {Promise<GetStaticPathsResult<{ slug: string[] }>["paths"]>} The static paths.
   * @example
   * Return static paths for `node--page` resources
   * ```ts
   * export async function getStaticPaths(context) {
   *   return {
   *     paths: await drupal.getStaticPathsFromContext("node--page", context),
   *     fallback: "blocking",
   *   }
   * }
   * ```
   *
   * Return static paths for `node--page` and `node--article` resources
   * ```ts
   * export async function getStaticPaths(context) {
   *   return {
   *     paths: await drupal.getStaticPathsFromContext(
   *       ["node--page", "node--article"],
   *       context
   *     ),
   *     fallback: "blocking",
   *   }
   * }
   * ```
   */
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

  /**
   * Builds static paths from resources.
   *
   * @param {Object[]} resources The resources.
   * @param {Object} options Options for the request.
   * @returns {Object[]} The built static paths.
   */
  buildStaticPathsFromResources(
    resources: {
      path: DrupalPathAlias
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

  /**
   * Builds static paths parameters from paths.
   *
   * @param {string[]} paths The paths.
   * @param {Object} options Options for the request.
   * @returns {Object[]} The built static paths parameters.
   */
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

  /**
   * Handles preview mode.
   *
   * @param {NextApiRequest} request The API request.
   * @param {NextApiResponse} response The API response.
   * @param {Object} options Options for the request.
   */
  async preview(
    request: NextApiRequest,
    response: NextApiResponse,
    options?: Parameters<NextApiResponse["setDraftMode"]>[0]
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { path, resourceVersion, plugin, secret, scope, ...draftData } =
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
            JSON.stringify({ path, resourceVersion, ...draftData })
          )}; Path=/; HttpOnly; SameSite=None; Secure`
        )
      }
      response.setHeader("Set-Cookie", cookies)

      // We can safely redirect to the path since this has been validated on the
      // server.
      response.writeHead(307, { Location: path })

      this.debug(`${useDraftMode ? "Draft" : "Preview"} mode enabled.`)

      return response.end()
    } catch (error) {
      this.debug(`Preview failed: ${error.message}`)
      return response.status(422).end()
    }
  }

  /**
   * Disables preview mode.
   *
   * @param {NextApiRequest} request The API request.
   * @param {NextApiResponse} response The API response.
   */
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

  /**
   * Gets the authentication configuration from the context and options.
   *
   * @param {GetStaticPropsContext} context The static props context.
   * @param {JsonApiWithAuthOption} options Options for the request.
   * @returns {NextDrupalAuth} The authentication configuration.
   */
  getAuthFromContextAndOptions(
    context: GetStaticPropsContext,
    options: JsonApiWithAuthOption
  ) {
    // If not in preview or withAuth is provided, use that.
    if (!context.preview) {
      // If we have provided an auth, use that.
      if (typeof options?.withAuth !== "undefined") {
        return options.withAuth
      }

      // Otherwise we fall back to the global auth.
      return this.withAuth
    }

    // If no plugin is provided, return.
    const plugin = context.previewData?.["plugin"]
    if (!plugin) {
      return null
    }

    let withAuth = this.auth

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
