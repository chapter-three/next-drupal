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
