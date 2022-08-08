import * as NodeArticle from "./node--article"
import * as ArticlesPublished from "./articles--published"

import { createQueries, QueryOpts, QueryParams } from "../../src"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"

const q = {
  "node--article": NodeArticle,
  "articles--published": ArticlesPublished,
}

export const queries = createQueries(q)

queries.getParams("node--article", {
  foo: "bar",
})

queries.getData("node--article", {})

type ParamOpts = QueryOpts<{
  id: number
}>

export const params = (opts: ParamOpts) => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type P = Parameters<typeof params>[0]
