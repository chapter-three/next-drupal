import type { JsonApiError, JsonApiLinks } from "../jsonapi-errors"
import type { PathAlias } from "./drupal"

// TODO: any...ugh.
export interface JsonApiResponse extends Record<string, any> {
  jsonapi?: {
    version: string
    meta: Record<string, any>[]
  }
  data: Record<string, any>[]
  errors: JsonApiError[]
  meta: {
    count: number
    [key: string]: any
  }
  links?: JsonApiLinks
  included?: Record<string, any>[]
}

export interface JsonApiResourceBodyRelationship {
  data: {
    type: string
    id: string
  }
}

export interface JsonApiCreateResourceBody {
  data: {
    type?: string
    attributes?: Record<string, any>
    relationships?: Record<string, JsonApiResourceBodyRelationship>
  }
}

export interface JsonApiCreateFileResourceBody {
  data: {
    type?: string
    attributes: {
      type: string
      field: string
      filename: string
      file: Buffer
    }
  }
}

export interface JsonApiUpdateResourceBody {
  data: {
    type?: string
    id?: string
    attributes?: Record<string, any>
    relationships?: Record<string, JsonApiResourceBodyRelationship>
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface JsonApiResource extends Record<string, any> {
  id: string
  type: string
  langcode: string
  status: boolean
}

export interface JsonApiResourceWithPath extends JsonApiResource {
  path: PathAlias
}
