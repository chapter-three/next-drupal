import * as React from "react"

import { getMenuItems } from "./get-menu-items"
import { DrupalMenuLinkContent } from "./types"

export function useMenu(
  name: string
): {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
  error: unknown
  isLoading: boolean
} {
  const [items, setItems] = React.useState<DrupalMenuLinkContent[]>(null)
  const [tree, setTree] = React.useState<DrupalMenuLinkContent[]>(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true)
      try {
        const data = await getMenuItems(name)
        setItems(data)

        const { items: tree } = buildMenuTree(data)
        setTree(tree)

        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setError(error)
        setIsLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  return { items, tree, error, isLoading }
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
