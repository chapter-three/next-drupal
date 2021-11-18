import * as React from "react"
import { useRouter } from "next/router"

import { getMenu } from "./get-menu"
import { DrupalMenuLinkContent, FetchAPI } from "./types"

export function useMenu(
  name: string,
  options: {
    fetch?: FetchAPI
  }
): {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
  error: unknown
  isLoading: boolean
} {
  const router = useRouter()
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
        const data = await getMenu(name, {
          ...options,
          locale: router.locale,
          defaultLocale: router.defaultLocale,
        })
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    fetchMenuItems()
  }, [router.locale])

  return { ...data, error, isLoading }
}
