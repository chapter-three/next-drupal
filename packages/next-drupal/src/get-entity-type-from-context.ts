import { GetStaticPropsContext } from "next"

import { DrupalTranslatedPath } from "./types"
import { buildHeaders, buildUrl, getPathFromContext } from "./utils"

export async function getEntityTypeFromContext(
  context: GetStaticPropsContext,
  options?: {
    prefix?: string
  }
): Promise<DrupalTranslatedPath> {
  options = {
    prefix: "",
    ...options,
  }
  const url = buildUrl("/router/translate-path", {
    path: getPathFromContext(context, options.prefix),
  })

  const response = await fetch(url.toString(), {
    headers: await buildHeaders(),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}
