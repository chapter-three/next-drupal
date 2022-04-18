import * as React from "react"
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next"
import { DrupalNode, getPathsFromContext } from "next-drupal"
import { drupal } from "lib/drupal"

interface NodePageProps {
  node: DrupalNode
}

export default function NodePage({ node }: NodePageProps) {
  return <pre>{JSON.stringify(node, null, 2)}</pre>
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsFromContext("node--article", context),
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  context.preview = true
  // const path = drupal.getPathFromContext(context)
  drupal.auth = {
    clientId: "52ce1a10-bf5c-4c81-8edf-eea3af95da84",
    clientSecret: "SA9AGbHnx6pOamaAus2f9LG9XudHFjKs",
  }
  // const node = await drupal.getResourceByPath<DrupalNode>(path, {
  //   withAuth: true,
  // })

  const node = await drupal.getResourceFromContext<DrupalNode>(
    "node--article",
    context,
    {
      params: {
        include: "field_image",
      },
      withAuth: true,
    }
  )

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
    },
  }
}
