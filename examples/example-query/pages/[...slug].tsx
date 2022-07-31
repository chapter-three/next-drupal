import * as React from "react"
import { GetStaticPathsResult } from "next"

import { drupal } from "lib/drupal"
import { queries } from "queries"
import { NodeArticle } from "queries/node--article"
import { NodePage } from "queries/node--page"
import { Layout } from "components/layout"
import { Article } from "components/article"
import { Page } from "components/page"

const RESOURCE_TYPES = ["node--article", "node--page"] as const

interface ResourcePageProps {
  resource: NodeArticle | NodePage
}

export default function ResourcePage({ resource }: ResourcePageProps) {
  if (!resource) return null

  return (
    <Layout>
      {resource.type === "node--page" && <Page page={resource} />}
      {resource.type === "node--article" && <Article article={resource} />}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupal.getStaticPathsFromContext(
      Array.from(RESOURCE_TYPES),
      context
    ),
    fallback: "blocking",
  }
}

export async function getStaticProps(context) {
  const path = await drupal.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName as typeof RESOURCE_TYPES[number]

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const resource = await queries.getData(type, {
    context,
    id: path.entity.uuid,
  })

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
    },
  }
}
