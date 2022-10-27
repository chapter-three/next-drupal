import { QueryFormatter } from "next-drupal-query"
import { queries } from "queries"
import { SectionColumns } from "types"
import { DrupalParagraphColumns } from "types/drupal"

export const formatter: QueryFormatter<
  Partial<DrupalParagraphColumns>,
  SectionColumns
> = (paragraph): SectionColumns => {
  return {
    type: "section--columns",
    id: paragraph.id,
    heading: paragraph.field_heading,
    columns: paragraph.field_columns,
    sections: paragraph.field_items.map((item) =>
      queries.formatData(item.type, item)
    ),
  }
}
