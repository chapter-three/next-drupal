import { buildHeaders } from "../utils/build-headers"
import { buildUrl } from "../utils/build-url"
import { getPathFromContext } from "../utils/get-path-from-context"
import type { GetStaticPropsContext } from "next"
import type { AccessToken, DrupalTranslatedPath } from "../types"

export async function translatePath(
  path: string,
  options?: {
    accessToken?: AccessToken
  }
): Promise<DrupalTranslatedPath> {
  const url = buildUrl("/router/translate-path", {
    path,
  })

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(options),
  })

  if (!response.ok) {
    return null
  }

  const json = await response.json()

  return json
}

export async function translatePathFromContext(
  context: GetStaticPropsContext,
  options?: {
    accessToken?: AccessToken
    prefix?: string
  }
): Promise<DrupalTranslatedPath> {
  options = {
    prefix: "",
    ...options,
  }
  const path = getPathFromContext(context, options.prefix)

  const response = await translatePath(path, {
    accessToken: options.accessToken,
  })

  return response
}
