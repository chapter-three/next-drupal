import * as React from "react"
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next"
import Head from "next/head"
import {
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"

import { NodeArticle } from "@/components/node-article"
import { NodeLandingPage } from "@/components/node-landing-page"
import { NodeBasicPage } from "@/components/node-basic-page"
import { useLocale } from "@/components/locale-provider"

// Allow any here until JSON API resources are properly typed.
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface PageProps {
  node: Record<string, any>
}

export default function NodePage({ node }: PageProps) {
  const { setPaths } = useLocale()

  React.useEffect(() => {
    setPaths(
      node?.content_translations.map((translation) => ({
        path: translation.path,
        locale: translation.langcode,
      }))
    )
  }, [node])

  if (!node) return null

  return (
    <>
      <Head>
        <title>{node.title}</title>
      </Head>
      {node.type === "node--landing_page" && <NodeLandingPage node={node} />}
      {node.type === "node--page" && <NodeBasicPage node={node} />}
      {node.type === "node--article" && <NodeArticle node={node} />}
    </>
  )
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const resourceTypes = ["node--page", "node--landing_page", "node--article"]

  const paths = await getPathsFromContext(resourceTypes, context)

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<PageProps>> {
  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
    }
  }

  let params = {}
  if (type === "node--landing_page") {
    params = {
      include:
        "field_sections,field_sections.field_media.field_media_image,field_sections.field_items,field_sections.field_reusable_paragraph.paragraphs.field_items",
    }
  }

  if (type === "node--article") {
    params = {
      include: "field_image,uid",
    }
  }

  const node = await getResourceFromContext(type, context, {
    params,
  })

  if (
    !node ||
    !node.status ||
    (node.field_site &&
      !node.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID))
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
    },
    revalidate: 1,
  }
}
