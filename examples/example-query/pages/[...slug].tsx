import * as React from "react"
import { GetStaticPathsResult } from "next"

import { Resource } from "types"
import { drupal } from "lib/drupal"
import { queries } from "queries"
import { Layout, LayoutProps } from "components/layout"
import { Article } from "components/article"
import { LandingPage } from "components/landing-page"
import { Page } from "components/page"

const RESOURCE_TYPES = [
  "node--article",
  "node--page",
  "node--landing_page",
] as const

interface ResourcePageProps {
  menu: LayoutProps["menu"]
  resource: Resource
}

export default function ResourcePage({ menu, resource }: ResourcePageProps) {
  if (!resource) return null

  return (
    <Layout menu={menu}>
      {resource.type === "page" && <Page page={resource} />}
      {resource.type === "article" && <Article article={resource} />}
      {resource.type === "landing-page" && <LandingPage page={resource} />}
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
  if (!context.preview && "status" in resource && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      menu: await queries.getData("menu", { name: "main" }),
      resource,
    },
  }
}
