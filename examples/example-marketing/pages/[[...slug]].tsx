import * as React from "react"
import { GetStaticPathsContext, GetStaticPathsResult } from "next"
import Head from "next/head"
import {
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
  getView,
} from "next-drupal"

import { NodeArticle } from "@/nodes/node-article"
import { NodeLandingPage } from "@/nodes/node-landing-page"
import { NodeBasicPage } from "@/nodes/node-basic-page"
import { useRouter } from "next/router"

export default function NodePage({ node }) {
  const router = useRouter()
  if (!node) return null

  return (
    <>
      <Head>
        <title>{node.title}</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend. Built with paragraphs, views, menus and translations."
        />
        {node.content_translations.map((translation, index) =>
          translation.langcode !== router.locale ? (
            <link
              key={index}
              rel="alternate"
              hrefLang={translation.langcode}
              href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${translation.path}`}
            />
          ) : null
        )}
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

  return {
    paths: await getPathsFromContext(resourceTypes, context),
    fallback: true,
  }
}

export async function getStaticProps(context) {
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
    !node?.status ||
    (node.field_site &&
      !node.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID))
  ) {
    return {
      notFound: true,
    }
  }

  // Load initial view data.
  if (type === "node--landing_page") {
    for (const section of node.field_sections) {
      if (section.type === "paragraph--view" && section.field_view) {
        const view = await getView(section.field_view, {
          params: {
            include: "field_location,field_images.field_media_image",
          },
        })

        section.field_view = {
          name: section.field_view,
          ...view,
        }
      }
    }
  }

  return {
    props: {
      node,
    },
    revalidate: 1,
  }
}
