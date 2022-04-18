import { DrupalMenuLinkContent } from "next-drupal"
import { useQuery } from "react-query"

export function useMenu(name: string) {
  return useQuery<{
    items: DrupalMenuLinkContent[]
    tree: DrupalMenuLinkContent[]
  }>(
    ["menus", name],
    async () => {
      const response = await fetch(`/api/menu?name=${name}`)

      return await response.json()
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
}
