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
    deserialize?: boolean
    params?: {}
  } = {
    deserialize: false,
  }
) {
  const {
    previewData = {},
    params: { slug },
  } = context
  const { resourceVersion } = previewData
  const { prefix = "", params } = options

  // TODO: Replace this and getEntity with a decoupled-router + subrequests call?
  const entities = await getEntitiesFromContext(entity_type, bundle, context, {
    ...options,
    deserialize: false,
  })

  if (!entities?.data?.length) {
    return null
  }

  const alias = !slug
    ? process.env.DRUPAL_FRONT_PAGE
    : `${prefix}/${(slug as string[]).join("/")}`

  // Find the entity based on the slug.
  const _entity = entities.data.find(
    (entity) => entity.attributes.path.alias === alias
  )

  if (!_entity) return null

  const entity = await getEntity(entity_type, bundle, _entity.id, {
    resourceVersion,
    params,
  })

  if (!entity) return null

  return options.deserialize ? deserialize(entity) : entity
}
