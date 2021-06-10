import { deserialize } from "./deserialize"
import { getAccessToken } from "./get-access-token"

export async function getMenuItems(
  name: string,
  options?: {
    deserialize?: boolean
  }
) {
  options = {
    deserialize: true,
    ...options,
  }

  const url = new URL(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/menu_items/${name}`
  )

  const { access_token } = await getAccessToken()
  const result = await fetch(url.toString(), {
    method: "GET",
    headers: access_token
      ? {
          Authorization: `Bearer ${access_token}`,
        }
      : {},
  })

  if (!result.ok) {
    throw new Error(result.statusText)
  }

  const data = await result.json()

  return options.deserialize ? deserialize(data) : data
}
