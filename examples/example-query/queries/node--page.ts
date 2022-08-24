import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from "next-drupal-query"
import { DrupalTranslatedPath } from "next-drupal"

import { Page } from "types"
import { DrupalNodePage } from "types/drupal"
import { drupal } from "lib/drupal"
import { queries } from "queries"

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addFields("node--page", ["title", "body", "status"])
}

type DataOpts = QueryOpts<{
  path: DrupalTranslatedPath
  id: string
}>

export const data: QueryData<DataOpts, DrupalNodePage> = async (
  opts
): Promise<DrupalNodePage> => {
  return await drupal.getResourceFromContext<DrupalNodePage>(
    opts.path,
    opts.context,
    {
      params: params().getQueryObject(),
    }
  )
}

export const formatter: QueryFormatter<DrupalNodePage, Page> = (node) => {
  return {
    type: "page",
    id: node.id,
    status: node.status,
    title: node.title,
    content: node.body?.processed,
  }
}
