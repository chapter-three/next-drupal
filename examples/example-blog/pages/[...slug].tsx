import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next"
import Head from "next/head"
import Image from "next/image"
import {
  DrupalNode,
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"

import { Layout } from "@/components/layout"
import { PostMeta } from "@/components/post-meta"

interface NodePageProps {
  node: DrupalNode
}

export default function NodePage({ node }: NodePageProps) {
  if (!node) return null

  return (
    <Layout>
      <Head>
        <title>{node.title}</title>
      </Head>
      <div variant="container.sm" py="4|10|12">
        <article>
          <h1 variant="heading.h1">{node.title}</h1>
          {node.body?.summary ? (
            <p variant="text.lead" mt="4">
              {node.body.summary}
            </p>
          ) : null}
          <PostMeta post={node} />
          <hr />
          {node.field_image?.uri && (
            <div>
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
                width={800}
                height={450}
                layout="intrinsic"
                objectFit="cover"
              />
              {node.field_image.resourceIdObjMeta.alt && (
                <p variant="text.sm" textAlign="center">
                  {node.field_image.resourceIdObjMeta.alt}
                </p>
              )}
            </div>
          )}
          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{ __html: node.body?.processed }}
              sx={{
                p: {
                  variant: "text",
                  fontFamily: "serif",
                  fontSize: "xl",
                  my: 8,
                  lineHeight: 8,
                },
              }}
            />
          )}
        </article>
      </div>
    </Layout>
  )
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsFromContext(["node--page", "node--article"], context),
    fallback: true,
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
    }
  }

  const apiParams = new DrupalJsonApiParams()

  if (type === "node--article") {
    apiParams.addInclude(["field_image", "uid"])
  }

  const node = await getResourceFromContext<DrupalNode>(type, context, {
    params: apiParams.getQueryObject(),
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

  return {
    props: {
      node,
    },
    revalidate: 60,
  }
}
