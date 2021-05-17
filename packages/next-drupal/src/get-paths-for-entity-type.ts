import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"

export async function getPathsForEntityType(
  entity_type: string,
  bundle: string,
  options: {
    deserialize?: boolean
    params?: Record<string, string>
    filter?: (entity) => boolean
  } = {}
) {
  // Default options.
  options = {
    deserialize: true,
    ...options,
  }

  // Use sparse fieldset to expand max size.
  options.params = {
    [`fields[${entity_type}--${bundle}]`]: "path",
    ...options?.params,
  }

  let entities = await getEntities(entity_type, bundle, options)
  if (!entities?.data?.length) {
    return []
  }

  if (options?.deserialize) {
    entities = deserialize(entities)
  }

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
