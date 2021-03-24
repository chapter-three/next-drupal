import { GetStaticPropsContext } from "next"
import { deserialize } from "./deserialize"
import { getAccessToken } from "./get-access-token"

export async function getEntityFromContext(
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options: {
    prefix?: string
    deserialize?: boolean
    params?: {}
  } = {
    deserialize: false,
  }
) {
  const {
    previewData = {},
    params: { slug },
  } = context
  const { resourceVersion } = previewData
  const { prefix = "", params } = options

  const path = !slug
    ? process.env.DRUPAL_FRONT_PAGE
    : `${prefix}/${(slug as string[]).join("/")}`

  const entity = await resolveEntityUsingPath(path, {
    resourceVersion,
    params,
  })

  if (!entity) return null

  return options.deserialize ? deserialize(entity) : entity
}

async function resolveEntityUsingPath(
  path: string,
  options?: { resourceVersion?: any; params?: {} }
) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/subrequests?_format=json`
    )

    const { resourceVersion = "rel:latest-version", params } = options
    const resourceParams = new URLSearchParams({
      resourceVersion,
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

    const { access_token } = await getAccessToken()
    const result = await fetch(url.toString(), {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(payload),
    })

    const json = await result.json()

    if (!json) {
      console.error(result)

      throw new Error(result.statusText)
    }

    return JSON.parse(json["resolvedResource#uri{0}"]?.body)
  } catch (error) {
    console.error(error)
  }
}
