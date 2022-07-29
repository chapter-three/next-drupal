import { DrupalNode } from "next-drupal"
import { QueryData, QueryOpts, QueryParams } from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "queries"
import { absoluteUrl, formatDate } from "lib/utils"

export type NodeArticle = {
  id: string
  type: "node--article"
  status: boolean
  title: string
  author: string
  date: string
  image: {
    url: string
    alt: string
  }
  body: string
}

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, NodeArticle> = async (
  opts
): Promise<NodeArticle> => {
  const node = await drupal.getResource<DrupalNode>("node--article", opts?.id, {
    params: params().getQueryObject(),
  })

  return {
    type: "node--article",
    id: node.id,
    title: node.title,
    status: node.status,
    author: node.uid.display_name,
    date: formatDate(node.created),
    image: {
      url: absoluteUrl(node.field_image.uri.url),
      alt: node.field_image.resourceIdObjMeta.alt,
    },
    body: node.body?.processed,
  }
}
