import { AccessToken, JsonApiWithLocaleOptions } from "./types"
import { buildHeaders, buildUrl, deserialize } from "./utils"

export async function getTaxonomy<T>(
  name: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
  } & JsonApiWithLocaleOptions
): Promise<{
  results: T
  links: {
    [key in "next" | "prev" | "self"]?: {
      href: "string"
    }
  }
}> {
  options = {
    deserialize: true,
    ...options,
  }

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ""

  const url = buildUrl(
    `${localePrefix}/jsonapi/taxonomy_term/${name}`,
    options.params
  )

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  const results = options.deserialize ? deserialize(data) : data

  return {
    results,
    links: data.links,
  }
}
