import { GetStaticPropsContext } from "next"
import { AccessToken, DrupalTranslatedPath } from "./types"
import { buildHeaders, buildUrl, getPathFromContext } from "./utils"

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
) {
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
