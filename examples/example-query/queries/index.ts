import { createQueries } from "@next-drupal/query"

import * as NodeArticle from "queries/node--article"
import * as NodeArticleTeaser from "queries/node--article--teaser"
import * as NodePage from "queries/node--page"
import * as ArticlesPublished from "queries/articles--published"
import * as ArticlesRelated from "queries/articles--related"

export const queries = createQueries({
  "node--article": NodeArticle,
  "node--article--teaser": NodeArticleTeaser,
  "node--page": NodePage,
  "articles--published": ArticlesPublished,
  "articles--related": ArticlesRelated,
})
