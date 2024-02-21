import {
  buildHeaders,
  buildUrl,
  deserialize,
  getJsonApiPathForResourceType,
} from "./utils"
import type { GetStaticPropsContext } from "next"
import type { AccessToken, JsonApiParams, JsonApiResource } from "../types"
import type { JsonApiWithLocaleOptions } from "../types/deprecated"

export async function getResourceCollection<T = JsonApiResource[]>(
  type: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
  } & JsonApiWithLocaleOptions
): Promise<T> {
  options = {
    deserialize: true,
    ...options,
  }

  const apiPath = await getJsonApiPathForResourceType(
    type,
    options?.locale !== options?.defaultLocale ? options.locale : undefined
  )

  if (!apiPath) {
    throw new Error(`Error: resource of type ${type} not found.`)
  }

  const url = buildUrl(apiPath, {
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

export async function getResourceCollectionFromContext<T = JsonApiResource[]>(
  type: string,
  context: GetStaticPropsContext,
  options?: {
    deserialize?: boolean
    params?: JsonApiParams
  }
): Promise<T> {
  options = {
    deserialize: true,
    ...options,
  }

  // // Filter out unpublished entities.
  // if (!context.preview) {
  //   options.params = {
  //     "filter[status]": "1",
  //     ...options.params,
  //   }
  // }

  return await getResourceCollection<T>(type, {
    ...options,
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
}
