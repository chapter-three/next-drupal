import { GetStaticPropsContext } from "next"
import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"
import { getEntity } from "./get-entity"

export async function getEntitiesFromContext(
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options: {
    prefix?: string
    params?: {}
  } = {}
) {
  // Filter out unpublished entities.
  if (!context.preview) {
    options.params = {
      ...options.params,
      "filter[status]": 1,
    }
  }

  const entities = await getEntities(entity_type, bundle, options)

  if (!entities) return null

  return deserialize(entities)
}
