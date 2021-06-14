import { DrupalMenuLinkContent, JsonApiWithLocaleOptions } from "./types"
import { buildUrl, deserialize } from "./utils"

export async function getMenu(
  name: string,
  options?: {
    deserialize?: boolean
  } & JsonApiWithLocaleOptions
): Promise<{
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
}> {
  options = {
    deserialize: true,
    ...options,
  }

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ""

  const url = buildUrl(`${localePrefix}/jsonapi/menu_items/${name}`)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  const items = options.deserialize ? deserialize(data) : data

  const { items: tree } = buildMenuTree(items)

  return {
    items,
    tree,
  }
}

function buildMenuTree(
  links: DrupalMenuLinkContent[],
  parent: DrupalMenuLinkContent["id"] = ""
) {
  const children = links.filter((link) => link.parent === parent)

  return children.length
    ? {
        items: children.map((link) => ({
          ...link,
          ...buildMenuTree(links, link.id),
        })),
      }
    : {}
}
