import { NextDrupalPages } from "./next-drupal-pages"
export const DrupalClient = NextDrupalPages

export * from "./deprecated/get-access-token"
export * from "./deprecated/get-menu"
export * from "./deprecated/get-paths"
export * from "./deprecated/get-resource-collection"
export * from "./deprecated/preview"
export * from "./deprecated/get-resource-type"
export * from "./deprecated/get-resource"
export * from "./deprecated/get-search-index"
export * from "./deprecated/get-view"
export * from "./deprecated/translate-path"
export {
  deserialize,
  buildUrl,
  getJsonApiIndex,
  getJsonApiPathForResourceType,
  syncDrupalPreviewRoutes,
} from "./deprecated/utils"

export type * from "./types/deprecated"
