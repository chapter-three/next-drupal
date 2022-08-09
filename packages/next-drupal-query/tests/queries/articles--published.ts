import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
} from "next-drupal-query"
import { queries } from "."

export type NodeArticleTeaser = {
  id: string
  type: "node--article"
  title: string
}

type ParamOpts = QueryOptsWithPagination<null>

export const params: QueryParams = (opts: ParamOpts) => {
  const params = queries
    .getParams("node--article")
    .addFilter("status", "1")
    .addSort("created", "DESC")

  return withPagination(params, opts)
}

export const data: QueryData = async (
  opts: ParamOpts
): Promise<NodeArticleTeaser[]> => {
  return [].map((node) => ({
    type: "node--article",
    id: node.id,
    title: node.title,
  }))
}
