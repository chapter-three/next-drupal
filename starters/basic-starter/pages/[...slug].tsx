import * as React from "react"
import Head from "next/head"
import {
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"
import { GetStaticPropsContext } from "next"
import { NodeArticle } from "@/nodes/node-article"
import { NodeBasicPage } from "@/components/nodes/node-basic-page"

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface NodePageProps {
  preview: GetStaticPropsContext["preview"]
  node: Record<string, any>
}

export default function NodePage({ node, preview }: NodePageProps) {
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
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      {showPreviewAlert && (
        <div className="fixed top-4 right-4">
          <a
            href="/api/exit-preview"
            className="bg-black text-white rounded-md px-4 py-2 text-sm"
          >
            Exit preview
          </a>
        </div>
      )}
      {node.type === "node--page" && <NodeBasicPage node={node} />}
      {node.type === "node--article" && <NodeArticle node={node} />}
    </>
  )
}

export async function getStaticPaths(context) {
  return {
    paths: await getPathsFromContext(["node--article", "node--page"], context),
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
  if (type === "node--article") {
    params = {
      include: "field_image,uid",
    }
  }

  const node = await getResourceFromContext(type, context, {
    params,
  })

  if (!node?.status) {
    return {
      notFound: true,
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
