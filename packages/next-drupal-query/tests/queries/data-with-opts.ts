import { QueryData, QueryOpts } from "../../src"

export type NodeArticle = {
  id: string
  type: "node--article"
  title: string
  author: string
}

type DataOpts = QueryOpts<{
  id: string
}>

export const data: QueryData<DataOpts, NodeArticle> = async (
  opts
): Promise<NodeArticle> => {
  return {
    type: "node--article",
    id: opts?.id || "2",
    title: "Title of Article",
    author: "shadcn",
  }
}
