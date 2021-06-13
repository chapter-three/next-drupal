import * as React from "react"

import { getMenu } from "./get-menu"
import { DrupalMenuLinkContent } from "./types"

export function useMenu(
  name: string
): {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
  error: unknown
  isLoading: boolean
} {
  const [data, setData] = React.useState<{
    items: DrupalMenuLinkContent[]
    tree: DrupalMenuLinkContent[]
  }>(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true)
      try {
        const data = await getMenu(name)
        setData(data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setError(error)
        setIsLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  return { ...data, error, isLoading }
}
