import { buildHeaders } from "../utils/build-headers"
import { buildUrl } from "../utils/build-url"
import { deserialize } from "../utils/deserialize"
import type { GetStaticPropsContext } from "next"
import type {
  AccessToken,
  JsonApiResource,
  JsonApiWithLocaleOptions,
} from "../types"

export async function getSearchIndex<T = JsonApiResource[]>(
  name: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
  } & JsonApiWithLocaleOptions
): Promise<T> {
  options = {
    deserialize: true,
    ...options,
  }

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ""

  const url = buildUrl(`${localePrefix}/jsonapi/index/${name}`, options.params)

  const response = await fetch(url.toString(), {
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
