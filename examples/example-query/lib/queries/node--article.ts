import { DrupalNode } from "next-drupal"
import { QueryData, QueryOpts, QueryParams } from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "lib/queries"
import { absoluteUrl, formatDate } from "lib/utils"

import { Article } from "components/article"

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, Article> = async (
  opts
): Promise<Article> => {
  const node = await drupal.getResource<DrupalNode>("node--article", opts?.id, {
    params: params().getQueryObject(),
  })

  return {
    id: node.id,
    type: "article",
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
