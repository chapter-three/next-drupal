import { buildHeaders, buildUrl, deserialize } from "./utils"

export async function getEntities(
  entity_type: string,
  bundle: string,
  options?: {
    deserialize?: boolean
    params?: Record<string, string>
  }
) {
  options = {
    deserialize: true,
    ...options,
  }

  const url = buildUrl(`/jsonapi/${entity_type}/${bundle}`, {
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
