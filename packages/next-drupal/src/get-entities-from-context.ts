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
    params?: {}
  } = {
    deserialize: false,
  }
) {
  // Filter out unpublished entities.
  if (!context.preview) {
    options.params = {
      ...options.params,
      "filter[status]": 1,
    }
  }

  const entities = await getEntities(entity_type, bundle, options)

  if (!entities?.data?.length) return null

  return options.deserialize ? deserialize(entities) : entities
}
