import { DrupalNode } from "next-drupal"
import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
} from "@next-drupal/query"

import { drupal } from "lib/drupal"
import { queries } from "queries"
import { NodeArticle } from "queries/node--article"

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

export type ArticlesRelated = (Pick<NodeArticle, "id" | "type" | "title"> & {
  url: string
})[]

export const data: QueryData<ParamOpts, ArticlesRelated> = async (
  opts
): Promise<ArticlesRelated> => {
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
  }))
}
