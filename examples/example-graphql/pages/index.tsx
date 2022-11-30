import Head from "next/head"

import { query } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"

export default function IndexPage({ articles }) {
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
        {articles?.length ? (
          articles.map((node) => (
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

export async function getStaticProps() {
  // Fetch the first 10 articles.
  const { data } = await query({
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
      articles: data?.nodeArticles?.nodes ?? [],
    },
  }
}
