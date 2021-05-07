import { getAccessToken } from "./get-access-token"

export async function getEntity(
  entityType: string,
  bundle: string,
  uuid: string,
  options?: {
    resourceVersion?: string
    params?: Record<string, string>
  }
) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/${entityType}/${bundle}/${uuid}`
    )

    const { resourceVersion = "rel:latest-version", params } = options
    url.search = new URLSearchParams({
      resourceVersion,
      ...params,
    }).toString()

    const { access_token } = await getAccessToken()
    const result = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!result.ok) {
      console.error(result)

      throw new Error(result.statusText)
    }

    return result.json()
  } catch (error) {
    console.error(error)
  }
}
