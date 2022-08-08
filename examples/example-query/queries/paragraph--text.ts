import { QueryFormatter } from "@next-drupal/query"

import { SectionText } from "types"
import { DrupalParagraphText } from "types/drupal"

export const formatter: QueryFormatter<
  Partial<DrupalParagraphText>,
  SectionText
> = (paragraph) => {
  return {
    type: "section--text",
    id: paragraph.id,
    text: paragraph.field_text?.processed,
  }
}
