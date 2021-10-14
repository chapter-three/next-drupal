export type Locale = string

export type JsonApiWithLocaleOptions = {
  params?: JsonApiParams
} & (
  | {
      locale: Locale
      defaultLocale: Locale
    }
  | {
      locale?: undefined
      defaultLocale?: never
    }
)

// TODO: Properly type this.
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type JsonApiParams = Record<string, any>

// TODO: any...ugh.
export interface JsonApiResponse extends Record<string, any> {
  jsonapi?: {
    version: string
    meta: Record<string, any>[]
  }
  data: Record<string, any>[]
  errors: Record<string, any>[]
  meta: {
    count: number
    [key: string]: any
  }
  links?: Record<string, any>[]
  included?: Record<string, any>[]
}

export interface DrupalTranslatedPath {
  resolved: string
  isHomePath: boolean
  entity: {
    canonical: string
    type: string
    bundle: string
    id: string
    uuid: string
  }
  label?: string
  jsonapi?: {
    individual: string
    resourceName: string
    pathPrefix: string
    basePath: string
    entryPoint: string
  }
  meta?: Record<string, unknown>
}

export interface DrupalMenuLinkContent {
  description: string
  enabled: boolean
  expanded: boolean
  id: string
  menu_name: string
  meta: Record<string, unknown>
  options: []
  parent: string
  provider: string
  route: {
    name: string
    parameters: Record<string, unknown>
  }
  title: string
  type: string
  url: string
  weight: string
  items?: DrupalMenuLinkContent[]
}

export type AccessToken = {
  token_type: string
  expires_in: number
  access_token: string
}

export type PathAlias = {
  alias: string
  pid: number
  langcode: string
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface JsonApiResource extends Record<string, any> {
  id: string
  type: string
  langcode: string
  status: boolean
}

export interface DrupalNode extends JsonApiResource {
  drupal_internal__nid: number
  drupal_internal__vid: number
  changed: string
  created: string
  title: string
  default_langcode: boolean
  path: PathAlias
  sticky: boolean
}

export interface DrupalParagraph extends JsonApiResource {
  drupal_internal__id: number
  drupal_internal__revision_id: number
}

export interface DrupalBlock extends JsonApiResource {
  info: string
}

export interface DrupalMedia extends JsonApiResource {
  drupal_internal__mid: string
  drupal_internal__vid: string
  changed: string
  created: string
  name: string
}

export interface DrupalTaxonomyTerm extends JsonApiResource {
  drupal_internal__tid: string
  changed: string
  default_langcode: boolean
  path: PathAlias
  name: string
  description: string
  weight: number
}

export interface DrupalUser extends JsonApiResource {
  drupal_internal__uid: string
  changed: string
  created: string
  default_langcode: boolean
  name: string
  path: PathAlias
}
