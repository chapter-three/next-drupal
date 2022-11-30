import Head from "next/head"
import { GetStaticPropsResult } from "next"

import { query } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"
import { Article } from "types"

interface IndexPageProps {
  nodes: Article[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeArticleTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {
  // Fetch the first 10 articles.
  const data = await query<{
    nodeArticles: {
      nodes: Article[]
    }
  }>({
    query: `
      query {
        nodeArticles(first: 10) {
          nodes {
            id
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
        }
      }
    `,
  })

  return {
    props: {
      nodes: data?.nodeArticles?.nodes ?? [],
    },
  }
}
