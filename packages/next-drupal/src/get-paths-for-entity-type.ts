import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"

export async function getPathsForEntityType(
  entity_type: string,
  bundle: string,
  options: {
    params?: Record<string, string>
    filter?: (entity) => boolean
  } = {}
) {
  // Use sparse fieldset to expand max size.
  options.params = {
    [`fields[${entity_type}--${bundle}]`]: "path",
    ...options?.params,
  }

  let entities = await getEntities(entity_type, bundle, options)
  if (!entities?.data?.length) {
    return []
  }

  entities = deserialize(entities)

  if (options?.filter) {
    entities = entities.filter(options.filter)
  }

  return entities.map((entity) => {
    const slug =
      entity.path.alias === process.env.DRUPAL_FRONT_PAGE
        ? "/"
        : entity.path.alias
    return {
      params: {
        slug: `${slug.replace(/^\/|\/$/g, "")}`.split("/"),
      },
    }
  })
}
