import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"

export async function getPathsForEntityType(
  entity_type: string,
  bundle: string,
  options?: {
    params?: {}
  }
) {
  const entities = await getEntities(entity_type, bundle, options)
  if (!entities) {
    return []
  }

  return deserialize(entities).map((entity) => {
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
