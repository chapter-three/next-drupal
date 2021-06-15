import { JsonApiWithLocaleOptions } from "./types"
import { buildUrl, deserialize } from "./utils"

export async function getView<T>(
  name: string,
  options?: {
    deserialize?: boolean
  } & JsonApiWithLocaleOptions
): Promise<{
  results: T
  count: number
  jsonApiUrl: string
}> {
  options = {
    deserialize: true,
    ...options,
  }

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ""

  const [viewId, displayId] = name.split("--")

  const url = buildUrl(
    `${localePrefix}/jsonapi/views/${viewId}/${displayId}`,
    options.params
  )

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  const results = options.deserialize ? deserialize(data) : data

  return {
    results,
    count: data.meta.count,
    jsonApiUrl: `${url.origin}${url.pathname}`,
  }
}
