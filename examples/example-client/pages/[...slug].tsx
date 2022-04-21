import * as React from "react"
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next"
import { DrupalNode, getPathsFromContext } from "next-drupal"

import { drupal } from "lib/drupal"
import { NodeArticle } from "components/node--article"
import Link from "next/link"

interface NodePageProps {
  node: DrupalNode
}

export default function NodePage({ node }: NodePageProps) {
  return (
    <div className="max-w-3xl py-10 mx-auto">
      <div className="px-6">
        <Link href="/" passHref>
          <a>Back to Articles</a>
        </Link>
      </div>
      <NodeArticle node={node} />
    </div>
  )
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsFromContext("node--article", context, {
      params: {
        "filter[status]": 1,
      },
    }),
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  const path = drupal.getPathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const node = await drupal.getResourceFromContext<DrupalNode>(path, context, {
    params: {
      include: "field_image,uid",
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
