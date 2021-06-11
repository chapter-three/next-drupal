import { buildUrl, deserialize } from "./utils"

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

  const url = buildUrl(`/jsonapi/menu_items/${name}`)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  return options.deserialize ? deserialize(data) : data
}
