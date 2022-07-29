import { DrupalNode } from "next-drupal"

import { QueryData, QueryOpts, QueryParams } from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "lib/queries"
import { Page } from "components/page"

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addFields("node--page", ["title", "body", "status"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, Page> = async (opts): Promise<Page> => {
  const node = await drupal.getResource<DrupalNode>("node--page", opts?.id, {
    params: params().getQueryObject(),
  })

  return {
    id: node.id,
    type: "page",
    status: node.status,
    title: node.title,
    body: node.body?.processed,
  }
}
