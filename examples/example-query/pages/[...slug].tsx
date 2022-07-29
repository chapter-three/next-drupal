import * as React from "react"
import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"

import { drupal } from "lib/drupal"
import { queries } from "lib/queries"

import { Layout } from "components/layout"
import { Article } from "components/article"
import { Page } from "components/page"

const dataIds = queries.getDataIds()
type ResourceType = typeof dataIds[number]

const RESOURCE_TYPES: ResourceType[] = ["node--article", "node--page"]

interface ResourcePageProps {
  resource: Article | Page
}

export default function ResourcePage({ resource }: ResourcePageProps) {
  if (!resource) return null

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "page" && <Page page={resource} />}
      {resource.type === "article" && <Article article={resource} />}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<ResourcePageProps>> {
  const path = await drupal.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const resource = (await queries.getData(
    path.jsonapi.resourceName as ResourceType,
    {
      context,
      id: path.entity.uuid,
    }
  )) as ResourcePageProps["resource"]

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
