import Head from "next/head"
import { Article } from "@/components/drupal/Article"
import { BasicPage } from "@/components/drupal/BasicPage"
import { Layout } from "@/components/Layout"
import { drupal, query } from "@/lib/drupal"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import type { NodeArticle, NodePage, NodesPath } from "@/types"

export const getStaticPaths = (async (context) => {
  // Fetch the paths for the first 50 articles and pages.
  // We'll fall back to on-demand generation for the rest.
  const data = await query<{
    nodeArticles: NodesPath
    nodePages: NodesPath
  }>({
    query: `query {
      nodeArticles(first: 50) {
        nodes {
          path,
        }
      }
      nodePages(first: 50) {
        nodes {
          path,
        }
      }
    }`,
  })

  // Build static paths.
  const paths = drupal.buildStaticPathsParamsFromPaths(
    [
      ...(data?.nodeArticles?.nodes as []),
      ...(data?.nodePages?.nodes as []),
    ].map(({ path }) => path)
  )

  return {
    paths,
    fallback: "blocking",
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  if (!context?.params?.slug) {
    return {
      notFound: true,
    }
  }

  const data = await query<{
    nodeByPath: NodeArticle | NodePage
  }>({
    query: `query ($path: String!){
      nodeByPath(path: $path) {
        ... on NodeArticle {
          __typename
          id
          title
          path
          author {
            displayName
          }
          body {
            processed
          }
          status
          created
          image {
            width
            url
            height
          }
        }
        ... on NodePage {
          __typename
          id
          title
          path
          body {
            processed
          }
        }
      }
    }`,
    variables: {
      path: `/${context.params.slug.join("/")}`,
    },
  })

  const resource = data?.nodeByPath

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!resource || (!context.preview && resource?.status === false)) {
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
  resource: NodeArticle | NodePage
}>

export default function Page({
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
      {resource.__typename === "NodePage" && <BasicPage node={resource} />}
      {resource.__typename === "NodeArticle" && <Article node={resource} />}
    </Layout>
  )
}
