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
  const path = drupal.getPathFromContext(context)

  const node = await drupal.getResourceFromContext<DrupalNode>(path, context, {
    params: {
      include: "field_image",
    },
  })

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
