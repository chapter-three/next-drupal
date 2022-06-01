import useSWRImmutable from "swr/immutable"
import { useRouter } from "next/router"
import { JsonApiResource } from "next-drupal"

type SearchResult = Pick<
  JsonApiResource,
  "type" | "id" | "title" | "path" | "created"
>

interface Search {
  isLoading?: boolean
  isError?: boolean
  results: SearchResult[]
  keys: string
}

export function useSearch(keys: string): Search {
  const router = useRouter()

  const { data, error } = useSWRImmutable<SearchResult[]>(
    keys ? `api/search/${keys}/${router.locale}` : null,
    async function () {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({
          keys,
          locale: router.locale,
          defaultLocale: router.defaultLocale,
        }),
      })

      return response.json()
    }
  )

  return {
    isLoading: !error && !data,
    isError: error,
    results: data,
    keys: keys,
  }
}
