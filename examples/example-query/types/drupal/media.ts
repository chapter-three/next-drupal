import { DrupalFile, DrupalJsonApiResource } from "./base"
import { FieldEntityReference } from "./field"

export interface DrupalMedia extends DrupalJsonApiResource {
  drupal_internal__mid: string
  drupal_internal__vid: string
  changed: string
  created: string
  name: string
}

export interface DrupalMediaImage extends DrupalMedia {
  type: "media--image"
  field_media_image: FieldEntityReference<DrupalFile>
}
