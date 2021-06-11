import { GetStaticPropsContext } from "next"
import { URLSearchParams } from "url"
import Jsona from "jsona"

import { getAccessToken } from "./get-access-token"

const dataFormatter = new Jsona()

export function deserialize(body, options?) {
  if (!body) return null

  console.log(dataFormatter)

  return dataFormatter.deserialize(body, options)
}

export function buildUrl(
  path: string,
  params?: string | Record<string, string> | URLSearchParams
): URL {
  const url = new URL(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}`)

  if (params) {
    url.search = new URLSearchParams(params).toString()
  }

  return url
}

export async function buildHeaders(
  headers: RequestInit["headers"] = {
    "Content-Type": "application/json",
  }
): Promise<RequestInit["headers"]> {
  const token = await getAccessToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token.access_token}`
  }

  return headers
}

export function getSlugFromParams(params: GetStaticPropsContext["params"]) {
  const { slug } = params
  return slug ? (Array.isArray(slug) ? slug.join("/") : slug) : null
}

export function getPathFromContext(
  context: GetStaticPropsContext,
  prefix = ""
) {
  const slug = getSlugFromParams(context.params)

  return !slug ? process.env.DRUPAL_FRONT_PAGE : `${prefix}/${slug}`
}
