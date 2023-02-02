import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"

import { Article, NodesPath, Page } from "types"
import { drupal, query } from "lib/drupal"
import { NodeArticle } from "components/node--article"
import { NodeBasicPage } from "components/node--basic-page"
import { Layout } from "components/layout"

interface NodePageProps {
  resource: Article | Page
}

export default function NodePage({ resource }: NodePageProps) {
  if (!resource) return null

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.__typename === "NodePage" && <NodeBasicPage node={resource} />}
      {resource.__typename === "NodeArticle" && <NodeArticle node={resource} />}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  // Fetch the paths for the first 50 articles and pages.
  // We'll fallback to on-demand generation for the rest.
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
    [...data?.nodeArticles?.nodes, ...data?.nodePages?.nodes].map(
      ({ path }) => path
    )
  )

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  if (!context?.params?.slug) {
    return {
      notFound: true,
    }
  }

  const data = await query<{
    nodeByPath: Article
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
}
