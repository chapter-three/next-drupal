import * as React from "react"
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from "next"
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

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface PageProps {
  preview: GetStaticPropsContext["preview"]
  node: Record<string, any>
}

export default function NodePage({ node, preview }: PageProps) {
  const router = useRouter()
  const [showPreviewAlert, setShowPreviewAlert] = React.useState<boolean>(false)

  if (!node) return null

  React.useEffect(() => {
    setShowPreviewAlert(preview && window.top === window.self)
  }, [])

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
      {showPreviewAlert && (
        <div
          sx={{
            position: "fixed",
            bottom: 4,
            right: 4,
            width: "auto",
            bg: "black",
            borderRadius: "xl",
            height: "40px",
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
          }}
        >
          <a
            href="/api/exit-preview"
            sx={{
              display: "inline-flex",
              color: "white",
              px: 3,
              py: 2,
              borderRadius: "md",
              ml: "auto",
            }}
          >
            Exit preview
          </a>
        </div>
      )}
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
    fallback: "blocking",
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
      preview: context.preview || false,
      node,
    },
    revalidate: 60,
  }
}
