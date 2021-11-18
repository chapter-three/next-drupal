import { GetStaticPropsContext } from "next"
import { AccessToken, FetchAPI } from "./types"
import { buildHeaders, buildUrl, getPathFromContext } from "./utils"

export async function getResourceTypeFromContext(
  context: GetStaticPropsContext,
  options?: {
    accessToken?: AccessToken
    prefix?: string
    fetch?: FetchAPI
  }
): Promise<string> {
  options = {
    prefix: "",
    fetch,
    ...options,
  }
  const url = buildUrl("/router/translate-path", {
    path: getPathFromContext(context, options.prefix),
  })

  const response = await options.fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return json.jsonapi.resourceName
}
