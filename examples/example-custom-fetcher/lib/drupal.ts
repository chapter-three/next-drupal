import { Unstable_DrupalClient as DrupalClient } from "next-drupal"
import crossFetch from "cross-fetch"

// We create a custom fetcher that we can pass to the DrupalClient.
const fetcher = (url, options) => {
  const { withAuth, ...opts } = options

  if (withAuth) {
    // Make additional requests to fetch a bearer token
    // Or any other Authorization headers.
  }

  return crossFetch(url, {
    ...opts,
  })
}

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    fetcher,
  }
)
