import { getAccessToken } from "./get-access-token"

export async function getEntities(
  entity_type: string,
  bundle: string,
  options: {
    params?: {}
  } = {}
) {
  try {
    const { params } = options
    const url = new URL(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/${entity_type}/${bundle}`
    )

    url.search = new URLSearchParams({
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
