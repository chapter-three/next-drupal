import { buildHeaders, buildUrl, deserialize } from "./utils"
import type {
  AccessToken,
  DrupalMenuLinkContent,
  JsonApiWithLocaleOptions,
} from "./types"

export async function getMenu<T extends DrupalMenuLinkContent>(
  name: string,
  options?: {
    deserialize?: boolean
    accessToken?: AccessToken
  } & JsonApiWithLocaleOptions
): Promise<{
  items: T[]
  tree: T[]
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

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

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
  if (!links?.length) {
    return {
      items: [],
    }
  }

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
