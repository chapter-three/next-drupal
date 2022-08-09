import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from "next-drupal-query"

import { LandingPage } from "types"
import { drupal } from "lib/drupal"
import { queries } from "queries"
import { DrupalNodeLandingPage } from "types/drupal"

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      "field_sections.field_items.field_media.field_media_image",
      "field_sections.field_items.field_items.field_media.field_media_image",
      "field_sections.field_items.field_items.field_items.field_media.field_media_image",
    ])
    .addFields("file--file", ["uri", "resourceIdObjMeta"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, DrupalNodeLandingPage> = async (
  opts
) => {
  return await drupal.getResource<DrupalNodeLandingPage>(
    "node--landing_page",
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )
}

export const formatter: QueryFormatter<DrupalNodeLandingPage, LandingPage> = (
  node
) => {
  return {
    id: node.id,
    type: "landing-page",
    title: node.title,
    status: node.status,
    sections: node.field_sections.map((paragraph) =>
      queries.formatData(paragraph.type, paragraph)
    ),
  }
}
