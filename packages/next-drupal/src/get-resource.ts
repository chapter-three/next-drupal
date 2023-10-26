import { stringify } from "qs"
import {
  buildHeaders,
  buildUrl,
  deserialize,
  getJsonApiPathForResourceType,
  getPathFromContext,
} from "./utils"
import type { GetStaticPropsContext } from "next"
import type {
  AccessToken,
  JsonApiParams,
  JsonApiResource,
  JsonApiWithLocaleOptions,
} from "./types"

export async function getResourceFromContext<T extends JsonApiResource>(
  type: string,
  context: GetStaticPropsContext,
  options?: {
    prefix?: string
    deserialize?: boolean
    params?: JsonApiParams
    accessToken?: AccessToken
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

  const path = getPathFromContext(context, options?.prefix)

  // Filter out unpublished entities.
  // if (!context.preview) {
  //   options.params = {
  //     "filter[status]": "1",
  //     ...options?.params,
  //   }
  // }

  const previewData = context.previewData as { resourceVersion?: string }

  const resource = await getResourceByPath<T>(path, {
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
  // if (!context.locale && !resource?.default_langcode) {
  //   return null
  // }

  return resource
}

export async function getResourceByPath<T extends JsonApiResource>(
  path: string,
  options?: {
    accessToken?: AccessToken
    deserialize?: boolean
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
    path = getPathFromContext({
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

  const url = buildUrl(subrequestsPath, {
    _format: "json",
  })

  const response = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders(options),
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

  return options.deserialize ? deserialize(data) : data
}

export async function getResource<T extends JsonApiResource>(
  type: string,
  uuid: string,
  options?: {
    accessToken?: AccessToken
    deserialize?: boolean
  } & JsonApiWithLocaleOptions
): Promise<T> {
  options = {
    deserialize: true,
    params: {},
    ...options,
  }

  const apiPath = await getJsonApiPathForResourceType(
    type,
    options?.locale !== options?.defaultLocale ? options.locale : undefined
  )

  if (!apiPath) {
    throw new Error(`Error: resource of type ${type} not found.`)
  }

  const url = buildUrl(`${apiPath}/${uuid}`, {
    ...options?.params,
  })

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return options.deserialize ? deserialize(json) : json
}
