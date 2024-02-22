import { GetStaticPathsResult, GetStaticPropsContext } from "next"
import Head from "next/head"

import { drupal, query } from "lib/drupal"
import { NodeArticle } from "components/node--article"
import { Layout } from "components/layout"

export default function NodePage({ resource }) {
  if (!resource) return null

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta
          key="description"
          name="description"
          content="A Next.js site powered by Drupal."
        />
      </Head>
      {resource && <NodeArticle node={resource} />}
    </Layout>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  // Fetch the paths for the first 50 articles.
  const { data } = await query({
    query: `query {
      nodeArticles(first: 50) {
        nodes {
          path,
        }
      }
    }`,
  })

  // Build static paths.
  const paths = drupal.buildStaticPathsParamsFromPaths(
    data?.nodeArticles?.nodes.map(({ path }) => path)
  )

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  // Translate the slug params from context into a Drupal path.
  const path = await drupal.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  // If a path is found, there's an article at that path.
  // Query the article by id.
  const { data } = await query({
    query: `query Article($id: ID!){
      nodeArticle(id: $id) {
        title
        path
        author {
          displayName
        }
        body {
          processed
        }
        created
        image {
          width
          url
          height
        }
      }
    }`,
    variables: {
      id: path.entity.uuid,
    },
  })

  const resource = data?.nodeArticle ?? null

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
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
}
