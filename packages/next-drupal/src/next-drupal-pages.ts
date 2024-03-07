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
    return this.constructPathFromSegment(context.params?.slug, {
      locale: context.locale,
      defaultLocale: context.defaultLocale,
      pathPrefix: options?.pathPrefix,
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
