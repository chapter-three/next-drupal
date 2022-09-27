import { PathAlias } from "next-drupal"

import { DrupalFile, DrupalJsonApiResource } from "./base"
import { FieldEntityReference, FieldTextFormatted } from "./field"
import {
  DrupalParagraphCard,
  DrupalParagraphColumns,
  DrupalParagraphImage,
  DrupalParagraphText,
} from "./paragraph"
import { DrupalUser } from "./user"

export interface DrupalNode extends DrupalJsonApiResource {
  title: string
  changed: string
  created: string
  path?: PathAlias
}

export interface DrupalNodeArticle extends DrupalNode {
  type: "node--article"
  body: FieldTextFormatted
  field_image: FieldEntityReference<DrupalFile>
  uid: FieldEntityReference<DrupalUser>
}

export interface DrupalNodePage extends DrupalNode {
  body: FieldTextFormatted
}

export interface DrupalNodeLandingPage extends DrupalNode {
  field_sections: FieldEntityReference<
    | DrupalParagraphColumns
    | DrupalParagraphCard
    | DrupalParagraphImage
    | DrupalParagraphText,
    "unlimited"
  >
}
