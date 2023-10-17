import { getJsonApiIndex } from "./get-json-api-index"
import type { Locale } from "../types"

export async function getJsonApiPathForResourceType(
  type: string,
  locale?: Locale
) {
  const index = await getJsonApiIndex(locale)

  return index?.links[type]?.href
}
