import { buildHeaders, buildUrl, deserialize } from "./utils"

export async function getEntity(
  entityType: string,
  bundle: string,
  uuid: string,
  options?: {
    resourceVersion?: string
    deserialize?: boolean
    params?: Record<string, string>
  }
) {
  options = {
    deserialize: true,
    ...options,
  }

  const { resourceVersion, params } = options
  const url = buildUrl(`/jsonapi/${entityType}/${bundle}/${uuid}`, {
    resourceVersion: resourceVersion || "rel:latest-version",
    ...params,
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
