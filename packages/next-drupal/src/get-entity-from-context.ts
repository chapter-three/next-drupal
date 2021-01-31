import { GetStaticPropsContext } from "next"
import { deserialize } from "./deserialize"
import { getEntitiesFromContext } from "./get-entities-from-context"
import { getEntity } from "./get-entity"

export async function getEntityFromContext(
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options: {
    prefix?: string
    params?: {}
  } = {}
) {
  const {
    previewData = {},
    params: { slug },
  } = context
  const { resourceVersion } = previewData
  const { prefix = "", params } = options

  // TODO: Replace this and getEntity with a decoupled-router + subrequests call?
  const entities = await getEntitiesFromContext(entity_type, bundle, context)

  if (!entities) {
    return null
  }

  const alias = !slug
    ? process.env.DRUPAL_FRONT_PAGE
    : `${prefix}/${(slug as string[]).join("/")}`

  const entity = entities.find((entity) => entity.path.alias === alias)

  if (!entity) return null

  return getEntity(entity_type, bundle, entity.id, { resourceVersion, params })
}
