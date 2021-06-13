import { GetStaticPropsContext } from "next"
import { JsonApiParams, JsonApiWithLocaleOptions } from "./types"
import {
  buildHeaders,
  buildUrl,
  deserialize,
  getJsonApiPathForResourceType,
  getPathFromContext,
} from "./utils"

export async function getResourceFromContext(
  type: string,
  context: GetStaticPropsContext,
  options?: {
    prefix?: string
    deserialize?: boolean
    params?: JsonApiParams
  }
) {
  options = {
    deserialize: true,
    ...options,
  }

  const path = getPathFromContext(context, options?.prefix)

  // Filter out unpublished entities.
  if (!context.preview) {
    options.params = {
      "filter[status]": "1",
      ...options?.params,
    }
  }

  const resource = await getResourceByPath(path, {
    deserialize: options.deserialize,
    params: {
      resourceVersion: context.previewData?.resourceVersion,
      ...options?.params,
    },
  })

  // If no locale is passed, skip entity if not default_langcode.
  // This happens because decoupled_router will still translate the path
  // to a resource.
  // TODO: Figure out if we want this behavior.
  // For now this causes a bug where a non-i18n sites builds (ISR) pages for
  // localized pages.
  if (!context.locale && !resource.default_langcode) {
    return null
  }

  return !context.preview && !resource.status ? null : resource
}

export async function getResourceByPath(
  path: string,
  options?: {
    deserialize?: boolean
  } & JsonApiWithLocaleOptions
) {
  options = {
    deserialize: true,
    params: {},
    ...options,
  }

  if (!path) {
    return null
  }

  if (options.locale && options.defaultLocale) {
    path = path === "/" ? path : path.replace(/^\/+/, "")
    path = getPathFromContext({
      params: { slug: [path] },
      locale: options.locale,
      defaultLocale: options.defaultLocale,
    })
  }

  const { resourceVersion = "rel:latest-version", ...params } = options?.params
  const resourceParams = new URLSearchParams({
    resourceVersion,
    ...params,
  }).toString()

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
      uri: `{{router.body@$.jsonapi.individual}}?${resourceParams}`,
      waitFor: ["router"],
    },
  ]

  const url = buildUrl("/subrequests", {
    _format: "json",
  })

  const response = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: await buildHeaders(),
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

export async function getResource(
  type: string,
  uuid: string,
  options?: {
    deserialize?: boolean
  } & JsonApiWithLocaleOptions
) {
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
    headers: await buildHeaders(),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return options.deserialize ? deserialize(json) : json
}
