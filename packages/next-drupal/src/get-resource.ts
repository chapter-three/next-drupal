import { GetStaticPropsContext } from "next"
import { JsonApiParams } from "./types"
import {
  buildHeaders,
  buildUrl,
  deserialize,
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
    params?: JsonApiParams
  }
) {
  options = {
    deserialize: true,
    params: {},
    ...options,
  }

  if (!path) {
    return null
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

  return options.deserialize ? deserialize(data) : data
}
