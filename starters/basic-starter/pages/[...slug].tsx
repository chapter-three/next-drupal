import Head from "next/head"
import {
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"
import { NodeArticle } from "@/nodes/node-article"
import { NodeBasicPage } from "@/components/nodes/node-basic-page"

export default function NodePage({ node }) {
  if (!node) return null

  return (
    <>
      <Head>
        <title>{node.title}</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend. Built with paragraphs, views, menus and translations."
        />
      </Head>
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
      node,
      revalidate: 60,
    },
  }
}
