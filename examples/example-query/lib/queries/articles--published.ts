import { DrupalNode } from "next-drupal"
import {
  QueryData,
  QueryParams,
  QueryParamsOptsWithPagination,
  withPagination,
} from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "lib/queries"
import { absoluteUrl, formatDate } from "lib/utils"
import { CardProps } from "components/card"

export type ArticlesPublished = CardProps[]

type ParamOpts = QueryParamsOptsWithPagination<null>

export const params: QueryParams<ParamOpts> = (opts) => {
  const params = queries
    .getParams("node--article--teaser")
    .addFilter("status", "1")
    .addSort("created", "DESC")

  return withPagination(params, opts)
}

export const data: QueryData<ParamOpts, ArticlesPublished> = async (opts) => {
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: params(opts).getQueryObject(),
    }
  )

  return nodes.map((node) => ({
    heading: node.title,
    url: node.path.alias,
    imageUrl: absoluteUrl(node.field_image.uri.url),
    date: formatDate(node.created),
  }))
}
