import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalArticle } from "@/types"

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

export default async function Home() {
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
  const nodes = data?.nodeArticles?.nodes ?? []

  return (
    <>
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
    </>
  )
}
