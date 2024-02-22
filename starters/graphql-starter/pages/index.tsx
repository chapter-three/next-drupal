import Head from "next/head"
import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { Layout } from "@/components/Layout"
import { query } from "@/lib/drupal"
import type { InferGetStaticPropsType, GetStaticProps } from "next"
import type { NodeArticle } from "@/types"

export const getStaticProps = (async (context) => {
  // Fetch the first 10 articles.
  const data = await query<{
    nodeArticles: {
      nodes: NodeArticle[]
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
}) satisfies GetStaticProps<{
  nodes: NodeArticle[]
}>

export default function Home({
  nodes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
          key="description"
        />
      </Head>
      <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
      {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <ArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No nodes found</p>
      )}
    </Layout>
  )
}
