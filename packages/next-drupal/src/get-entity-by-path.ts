import { buildHeaders, buildUrl, deserialize } from "./utils"

export async function getEntityByPath(
  path: string,
  options?: {
    resourceVersion?: string
    deserialize?: boolean
    params?: Record<string, unknown>
  }
) {
  options = {
    deserialize: true,
    ...options,
  }

  const { resourceVersion, params } = options
  const resourceParams = new URLSearchParams({
    resourceVersion: resourceVersion || "rel:latest-version",
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

  const data = JSON.parse(json["resolvedResource#uri{0}"]?.body)

  return options.deserialize ? deserialize(data) : data
}
