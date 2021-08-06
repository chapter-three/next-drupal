import { GetStaticPropsContext } from "next"
import { AccessToken, JsonApiParams, JsonApiWithLocaleOptions } from "./types"
import {
  buildHeaders,
  buildUrl,
  deserialize,
  getJsonApiPathForResourceType,
} from "./utils"

export async function getResourceCollection(
  type: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
  } & JsonApiWithLocaleOptions
) {
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

export async function getResourceCollectionFromContext(
  type: string,
  context: GetStaticPropsContext,
  options?: {
    deserialize?: boolean
    params?: JsonApiParams
  }
) {
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

  return await getResourceCollection(type, {
    ...options,
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
}
