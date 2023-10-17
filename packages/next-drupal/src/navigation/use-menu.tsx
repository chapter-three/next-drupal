import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getMenu } from "../query/get-menu"
import type { DrupalMenuLinkContent } from "../types"

export function useMenu<T extends DrupalMenuLinkContent>(
  name: string
): {
  items: T[]
  tree: T[]
  error: unknown
  isLoading: boolean
} {
  const router = useRouter()
  const [data, setData] = useState<{
    items: T[]
    tree: T[]
  }>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
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
