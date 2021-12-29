import { GetStaticPropsContext } from "next"
import {
  AccessToken,
  JsonApiParams,
  JsonApiWithLocaleOptions,
  JsonApiResource,
  FetchAPI,
} from "./types"
import {
  buildHeaders,
  buildUrl,
  deserialize,
  getJsonApiPathForResourceType,
} from "./utils"

export async function getResourceCollection<T = JsonApiResource[]>(
  type: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
    fetch?: FetchAPI
  } & JsonApiWithLocaleOptions
): Promise<T> {
  options = {
    deserialize: true,
    fetch,
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

  const response = await options.fetch(url.toString(), {
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
    fetch?: FetchAPI
  }
): Promise<T> {
  options = {
    deserialize: true,
    fetch,
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
