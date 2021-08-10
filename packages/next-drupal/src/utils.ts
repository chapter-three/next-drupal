import Jsona from "jsona"
import { GetStaticPropsContext } from "next"
import { getAccessToken } from "./get-access-token"
import { AccessToken, Locale } from "./types"

const JSONAPI_PREFIX = process.env.DRUPAL_JSONAPI_PREFIX || "/jsonapi"

const dataFormatter = new Jsona()

export function deserialize(body, options?) {
  if (!body) return null

  return dataFormatter.deserialize(body, options)
}

export async function getJsonApiPathForResourceType(
  type: string,
  locale?: Locale
) {
  const index = await getJsonApiIndex(locale)

  return index?.links[type]?.href
}

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

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}

export function buildUrl(
  path: string,
  params?: string | Record<string, string> | URLSearchParams
): URL {
  const url = new URL(
    path.charAt(0) === "/"
      ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}`
      : path
  )

  if (params) {
    url.search = new URLSearchParams(params).toString()
  }

  return url
}

export async function buildHeaders({
  accessToken,
  headers = {
    "Content-Type": "application/json",
  },
}: {
  accessToken?: AccessToken
  headers?: RequestInit["headers"]
} = {}): Promise<RequestInit["headers"]> {
  const token = accessToken || (await getAccessToken())
  if (token) {
    headers["Authorization"] = `Bearer ${token.access_token}`
  }

  return headers
}

export function getPathFromContext(
  context: GetStaticPropsContext,
  prefix = ""
) {
  let { slug } = context.params

  slug = Array.isArray(slug) ? slug.join("/") : slug

  // Handle locale.
  if (context.locale && context.locale !== context.defaultLocale) {
    slug = `/${context.locale}/${slug}`
  }

  return !slug
    ? process.env.DRUPAL_FRONT_PAGE
    : prefix
    ? `${prefix}/${slug}`
    : slug
}

export function syncDrupalPreviewRoutes(path) {
  if (window && window.top !== window.self) {
    window.parent.postMessage(
      { type: "NEXT_DRUPAL_ROUTE_SYNC", path },
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
    )
  }
}
