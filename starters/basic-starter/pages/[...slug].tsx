import Head from "next/head"
import { Article } from "@/components/drupal/Article"
import { BasicPage } from "@/components/drupal/BasicPage"
import { Layout } from "@/components/Layout"
import { drupal } from "@/lib/drupal"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import type { DrupalNode } from "next-drupal"

const RESOURCE_TYPES = ["node--page", "node--article"]

export const getStaticPaths = (async (context) => {
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const path = await drupal.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path?.jsonapi?.resourceName

  let params = {}
  if (type === "node--article") {
    params = {
      include: "field_image,uid",
    }
  }

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params,
    }
  )

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path?.jsonapi?.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
    },
  }
}) satisfies GetStaticProps<{
  resource: DrupalNode
}>

export default function NodePage({
  resource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!resource) return null

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta
          name="description"
          content="A Next.js site powered by Drupal."
          key="description"
        />
      </Head>
      {resource.type === "node--page" && <BasicPage node={resource} />}
      {resource.type === "node--article" && <Article node={resource} />}
    </Layout>
  )
}
