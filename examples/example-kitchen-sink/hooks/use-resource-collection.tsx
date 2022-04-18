import { JsonApiResource, JsonApiWithLocaleOptions } from "next-drupal"
import { stringify } from "qs"
import { useQuery } from "react-query"

import config from "config"

// This is a custom hook for fetching client-side data.
// This can be used inside components to fetch data from Drupal at runtime.
export function useResourceCollection<T = JsonApiResource[]>(
  name: string,
  options?: JsonApiWithLocaleOptions
) {
  // We use react-query to cache the data and only fetch it once.
  return useQuery<T>(
    ["resource-collection", name],
    async () => {
      const url = new URL(`${config.baseUrl}/api/resources/${name}`)

      if (options) {
        url.search = stringify(options)
      }

      const response = await fetch(url.toString())

      return await response.json()
    },
    {
      refetchOnWindowFocus: false,

      // Only fetch data on refresh.
      // Do not refetch on route change.
      refetchOnMount: false,
    }
  )
}
