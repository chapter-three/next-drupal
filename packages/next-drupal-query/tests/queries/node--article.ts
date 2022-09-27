import {
  QueryData,
  QueryOpts,
  QueryOptsWithPagination,
  QueryParams,
} from "../../src"
import { queries } from "."

export type NodeArticle = {
  id: string
  type: "node--article"
  title: string
  author: string
}

type ParamOpts = QueryOptsWithPagination<{
  id: number
}>

export const params: QueryParams<ParamOpts> = (opts) => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, NodeArticle> = async (
  opts
): Promise<NodeArticle> => {
  return {
    type: "node--article",
    id: "id",
    title: "Title of Article",
    author: "shadcn",
  }
}
