import { GetStaticPropsContext } from "next"
import { getEntities } from "./get-entities"

export async function getEntitiesFromContext(
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options?: {
    prefix?: string
    deserialize?: boolean
    params?: Record<string, string>
  }
) {
  // Filter out unpublished entities.
  if (!context.preview) {
    options.params = {
      "filter[status]": "1",
      ...options.params,
    }
  }

  return await getEntities(entity_type, bundle, options)
}
