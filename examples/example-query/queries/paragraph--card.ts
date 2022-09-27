import { QueryFormatter } from "next-drupal-query"

import { SectionCard } from "types"
import { queries } from "queries"
import { DrupalParagraphCard } from "types/drupal"

export const formatter: QueryFormatter<
  Partial<DrupalParagraphCard>,
  SectionCard
> = (paragraph) => {
  return {
    type: "section--card",
    id: paragraph.id,
    heading: paragraph.field_heading,
    text: paragraph.field_text.processed,
    image: queries.formatData("media--image", paragraph.field_media),
  }
}
