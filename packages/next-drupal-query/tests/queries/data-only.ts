import { QueryData } from "../../src"

export type NodeArticle = {
  id: string
  type: "node--article"
  title: string
  author: string
}

export const data: QueryData<
  null,
  NodeArticle
> = async (): Promise<NodeArticle> => {
  return {
    type: "node--article",
    id: "id",
    title: "Title of Article",
    author: "shadcn",
  }
}
