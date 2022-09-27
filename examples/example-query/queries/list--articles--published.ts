import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
  QueryFormatter,
} from "next-drupal-query"

import { ArticleTeaser } from "types"
import { DrupalNodeArticle } from "types/drupal"
import { drupal } from "lib/drupal"
import { queries } from "queries"

type ParamOpts = QueryOptsWithPagination<null>

export const params: QueryParams<ParamOpts> = (opts) => {
  const params = queries
    .getParams("node--article--teaser")
    .addFilter("status", "1")
    .addSort("created", "DESC")

  return withPagination(params, opts)
}

export const data: QueryData<ParamOpts, DrupalNodeArticle[]> = async (
  opts
): Promise<DrupalNodeArticle[]> => {
  return await drupal.getResourceCollection<DrupalNodeArticle[]>(
    "node--article",
    {
      params: params(opts).getQueryObject(),
    }
  )
}

export const formatter: QueryFormatter<DrupalNodeArticle[], ArticleTeaser[]> = (
  nodes
) => {
  return nodes.map((node) => queries.formatData("node--article--teaser", node))
}
