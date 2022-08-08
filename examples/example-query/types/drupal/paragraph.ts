import { DrupalJsonApiResource } from "./base"
import { FieldEntityReference, FieldList, FieldTextFormatted } from "./field"
import { DrupalMediaImage } from "./media"

export const fieldColumnTypes = {
  "25-75": "25-75",
  "50-50": "50-50",
  "33-33-33": "33-33-33",
  "75-25": "75-25",
} as const

export type ParagrapTypes = Pick<
  | DrupalParagraphColumns
  | DrupalParagraphCard
  | DrupalParagraphImage
  | DrupalParagraphText,
  "type"
>["type"]

export interface DrupalParagraph extends DrupalJsonApiResource {
  type: ParagrapTypes
}

export interface DrupalParagraphColumns extends DrupalParagraph {
  type: "paragraph--columns"
  field_heading: string
  field_columns: FieldList<typeof fieldColumnTypes>
  field_items: FieldEntityReference<
    DrupalParagraphCard | DrupalParagraphImage | DrupalParagraphText,
    "unlimited"
  >
}

export interface DrupalParagraphCard extends DrupalParagraph {
  type: "paragraph--card"
  field_heading: string
  field_text: FieldTextFormatted
  field_media: FieldEntityReference<DrupalMediaImage>
}

export interface DrupalParagraphImage extends DrupalParagraph {
  type: "paragraph--image"
  field_media: FieldEntityReference<DrupalMediaImage>
}

export interface DrupalParagraphText extends DrupalParagraph {
  type: "paragraph--text"
  field_text: FieldTextFormatted
}
