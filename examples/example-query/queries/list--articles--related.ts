import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
  QueryFormatter,
  QueryOpts,
} from "next-drupal-query"

import { ArticleRelated } from "types"
import { DrupalNodeArticle } from "types/drupal"
import { drupal } from "lib/drupal"
import { queries } from "queries"

type ParamOpts = QueryOptsWithPagination<{
  excludeIds?: string[]
}>

export const params: QueryParams<ParamOpts> = (opts) => {
  const params = queries
    .getParams("node--article")
    .addFields("node--article", ["title", "path"])
    .addFilter("status", "1")
    .addSort("created", "DESC")

  if (opts.excludeIds) {
    params.addFilter("id", opts.excludeIds, "NOT IN")
  }

  return withPagination(params, opts)
}

type DataOpts = QueryOpts<{
  excludeIds?: string[]
}>

export const data: QueryData<DataOpts, DrupalNodeArticle[]> = async (
  opts
): Promise<DrupalNodeArticle[]> => {
  return await drupal.getResourceCollectionFromContext<DrupalNodeArticle[]>(
    "node--article",
    opts.context,
    {
      params: params({ excludeIds: opts.excludeIds }).getQueryObject(),
    }
  )
}

export const formatter: QueryFormatter<
  DrupalNodeArticle[],
  ArticleRelated[]
> = (nodes) => {
  return nodes.map((node) => ({
    type: "article",
    id: node.id,
    title: node.title,
    url: node.path.alias,
  }))
}
