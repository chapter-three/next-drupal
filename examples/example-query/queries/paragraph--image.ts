import { QueryFormatter } from "@next-drupal/query"

import { queries } from "queries"
import { SectionImage } from "types"
import { DrupalParagraphImage } from "types/drupal"

export const formatter: QueryFormatter<
  Partial<DrupalParagraphImage>,
  SectionImage
> = (paragraph): SectionImage => {
  return {
    type: "section--image",
    id: paragraph.id,
    image: queries.formatData("media--image", paragraph.field_media),
  }
}
