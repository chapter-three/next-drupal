import { buildHeaders } from "./build-headers"
import { buildUrl } from "./build-url"
import type { AccessToken, Locale } from "../types"

const JSONAPI_PREFIX = process.env.DRUPAL_JSONAPI_PREFIX || "/jsonapi"

export async function getJsonApiIndex(
  locale?: Locale,
  options?: {
    accessToken?: AccessToken
  }
): Promise<{
  links: {
    [type: string]: {
      href: string
    }
  }
}> {
  const url = buildUrl(
    locale ? `/${locale}${JSONAPI_PREFIX}` : `${JSONAPI_PREFIX}`
  )

  // As per https://www.drupal.org/node/2984034 /jsonapi is public.
  // We only call buildHeaders if accessToken or locale is explicitly set.
  // This is for rare cases where /jsonapi might be protected.
  const response = await fetch(url.toString(), {
    headers:
      locale || options
        ? await buildHeaders(options)
        : {
            "Content-Type": "application/json",
          },
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}
