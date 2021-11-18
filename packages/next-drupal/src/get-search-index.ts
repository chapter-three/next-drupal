import { GetStaticPropsContext } from "next"
import { FetchAPI } from "."
import { AccessToken, JsonApiResource, JsonApiWithLocaleOptions } from "./types"
import { buildHeaders, buildUrl, deserialize } from "./utils"

export async function getSearchIndex<T = JsonApiResource[]>(
  name: string,
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

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ""

  const url = buildUrl(`${localePrefix}/jsonapi/index/${name}`, options.params)

  const response = await options.fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return options.deserialize ? deserialize(json) : json
}

export async function getSearchIndexFromContext<T = JsonApiResource[]>(
  name: string,
  context: GetStaticPropsContext,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
    fetch?: FetchAPI
  } & JsonApiWithLocaleOptions
): Promise<T> {
  options = {
    deserialize: true,
    ...options,
  }

  return await getSearchIndex<T>(name, {
    ...options,
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
}
