import * as React from "react"
import { GetServerSidePropsResult } from "next"
import {
  DrupalNode,
  getResourceFromContext,
  translatePathFromContext,
} from "next-drupal"

import { getMenus } from "lib/get-menus"
import { getParams } from "lib/get-params"
import { Node } from "components/node"
import { Layout, LayoutProps } from "components/layout"
import { Meta } from "components/meta"

const RESOURCE_TYPES = ["node--page", "node--article"]

interface NodePageProps extends LayoutProps {
  node: DrupalNode
}

export default function NodePage({ node, menus }: NodePageProps) {
  return (
    <Layout menus={menus}>
      <Meta title={node.title} tags={node.metatag} path={node.path?.alias} />
      <Node node={node} />
    </Layout>
  )
}

export async function getServerSideProps(
  context
): Promise<GetServerSidePropsResult<NodePageProps>> {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  )

  const path = await translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  // Check for redirect
  if (path.redirect?.length) {
    const [redirect] = path.redirect
    return {
      redirect: {
        destination: redirect.to,
        permanent: redirect.status === "301",
      },
    }
  }

  const type = path.jsonapi.resourceName

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const node = await getResourceFromContext<DrupalNode>(type, context, {
    params: getParams(type),
  })

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
      menus: await getMenus(context),
    },
  }
}
