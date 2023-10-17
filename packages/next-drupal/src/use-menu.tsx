import { useRouter } from "next/router"
import * as React from "react"
import { getMenu } from "./get-menu"
import type { DrupalMenuLinkContent } from "./types"

export function useMenu<T extends DrupalMenuLinkContent>(
  name: string
): {
  items: T[]
  tree: T[]
  error: unknown
  isLoading: boolean
} {
  const router = useRouter()
  const [data, setData] = React.useState<{
    items: T[]
    tree: T[]
  }>(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true)
      try {
        const data = await getMenu<T>(name, {
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
