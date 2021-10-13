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

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface JsonApiResource extends Record<string, any> {
  id: string
  type: string
  langcode: string
  status: boolean
}

export interface DrupalNode extends JsonApiResource {
  title: string
  changed: string
  created: string
  drupal_internal__nid: number
  drupal_internal__vid: number
  default_langcode: boolean
  path: {
    alias: string
    pid: number
    langcode: string
  }
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
  name: string
  changed: string
  created: string
  drupal_internal__mid: string
  drupal_internal__vid: string
}
