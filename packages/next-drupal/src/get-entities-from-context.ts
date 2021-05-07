import { GetStaticPropsContext } from "next"
import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"

export async function getEntitiesFromContext(
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options: {
    prefix?: string
    deserialize?: boolean
    params?: Record<string, string>
    filter?: (entity) => boolean
  }
) {
  // Filter out unpublished entities.
  if (!context.preview) {
    options.params = {
      ...options.params,
      "filter[status]": "1",
    }
  }

  let entities = await getEntities(entity_type, bundle, options)

  if (!entities?.data?.length) return null

  entities = options.deserialize ? deserialize(entities) : entities

  if (options?.filter) {
    entities = entities.filter(options.filter)
  }

  return entities
}
