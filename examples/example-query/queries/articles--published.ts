import { DrupalNode } from "next-drupal"
import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
} from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "queries"
import { absoluteUrl, formatDate } from "lib/utils"
import { NodeArticleTeaser } from "queries/node--article--teaser"

type ParamOpts = QueryOptsWithPagination<null>

export const params: QueryParams<ParamOpts> = (opts) => {
  const params = queries
    .getParams("node--article--teaser")
    .addFilter("status", "1")
    .addSort("created", "DESC")

  return withPagination(params, opts)
}

export const data: QueryData<ParamOpts, NodeArticleTeaser[]> = async (
  opts
): Promise<NodeArticleTeaser[]> => {
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: params(opts).getQueryObject(),
    }
  )

  return nodes.map((node) => ({
    type: "node--article",
    id: node.id,
    title: node.title,
    url: node.path.alias,
    date: formatDate(node.created),
    image: {
      url: absoluteUrl(node.field_image.uri.url),
      alt: node.field_image.resourceIdObjMeta.alt,
    },
  }))
}
