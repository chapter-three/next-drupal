import { GetStaticPropsContext } from "next"
import { getEntityByPath } from "./get-entity-by-path"
import { getPathFromContext } from "./utils"

export async function getEntityFromContext(
  // entity_type and bundle are kept for consistency with getEntitiesFromContext.
  // TODO: Remove this?
  entity_type: string,
  bundle: string,
  context: GetStaticPropsContext,
  options?: {
    prefix?: string
    deserialize?: boolean
    params?: Record<string, unknown>
  }
) {
  const path = getPathFromContext(context, options?.prefix)

  return await getEntityByPath(path, {
    resourceVersion: context.previewData?.resourceVersion,
    deserialize: options?.deserialize || true,
    params: options?.params || {},
  })
}
