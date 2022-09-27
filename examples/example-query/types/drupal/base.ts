import { DrupalFileMeta } from "next-drupal"

/**
 * The JsonApiResource shipped in next-drupal allows any field to set on a type.
 *
 * This is by designed. We want next-drupal to support all field types out of the box
 * without having to manually define field.s
 *
 * In this example, however, we want to demo how a fully-typed system would look like.
 *
 * Instead of extending JsonApiResource from next-drupal, we define our own.
 */
export interface DrupalJsonApiResource {
  id: string
  type: string
  langcode: string
  status: boolean
}

export interface DrupalFile extends DrupalJsonApiResource {
  changed: string
  created: string
  filename: string
  uri: {
    value: string
    url: string
  }
  filesize: number
  filemime: string
  resourceIdObjMeta?: DrupalFileMeta
}
