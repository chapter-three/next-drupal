import Head from "next/head"
import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { Layout } from "@/components/Layout"
import { drupal } from "@/lib/drupal"
import type { InferGetStaticPropsType, GetStaticProps } from "next"
import type { DrupalArticle } from "@/types"

export const getStaticProps = (async (context) => {
  // Fetch the first 10 articles.
  const data = await drupal.query<{
    nodeArticles: {
      nodes: DrupalArticle[]
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
              name
            }
            body {
              processed
            }
            created {
              time
            }
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
  nodes: DrupalArticle[]
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
