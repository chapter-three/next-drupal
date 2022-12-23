import { JsonApiParams } from "next-drupal"
import { useRouter } from "next/router"
import { useInfiniteQuery } from "@tanstack/react-query"

interface SearchParams extends JsonApiParams {
  page?: number
}

const NUMBER_OF_RESULTS_PER_PAGE = 1

async function fetchSearch(params: SearchParams) {
  const response = await fetch("/api/search/paginated", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: params.page,
      params: {
        fields: {
          "node--article": "id,title,created,field_image",
        },
        include: "field_image",
        filter: {
          fulltext: params.keywords,
        },
        page: {
          limit: NUMBER_OF_RESULTS_PER_PAGE,
          offset: params.page * NUMBER_OF_RESULTS_PER_PAGE,
        },
      },
    }),
  })

  return response.json()
}

export function usePaginatedSearch(params: SearchParams = { page: 0 }) {
  const router = useRouter()

  const query = router.query

  const results = useInfiniteQuery(
    ["search", router],
    ({ pageParam = params.page }) => {
      return fetchSearch({ ...router.query, page: pageParam })
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 0,
      initialData: {
        pageParams: [params.page],
        pages: [],
      },
      enabled: Object.keys(query)?.length !== 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextPage ?? undefined
      },
    }
  )

  return { ...results, query }
}
