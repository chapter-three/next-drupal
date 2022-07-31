import { DrupalNode } from "next-drupal"

import { QueryData, QueryOpts, QueryParams } from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "queries"

export type NodePage = {
  id: string
  status: boolean
  type: "node--page"
  title: string
  body?: string
}

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addFields("node--page", ["title", "body", "status"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, NodePage> = async (
  opts
): Promise<NodePage> => {
  const node = await drupal.getResource<DrupalNode>("node--page", opts?.id, {
    params: params().getQueryObject(),
  })

  return {
    type: "node--page",
    id: node.id,
    status: node.status,
    title: node.title,
    body: node.body?.processed,
  }
}
