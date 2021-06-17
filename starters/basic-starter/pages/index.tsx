import { getResourceCollectionFromContext } from "next-drupal"
import { NodeArticleTeaser } from "@/components/nodes/node-article"

export default function IndexPage({ articles }) {
  return (
    <div>
      <h1 className="text-6xl font-black mb-10">Latest Articles.</h1>

      {articles?.length ? (
        articles.map((node) => (
          <div key={node.id}>
            <NodeArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No articles found</p>
      )}
    </div>
  )
}

export async function getStaticProps(context) {
  const articles = await getResourceCollectionFromContext(
    "node--article",
    context,
    {
      params: {
        include: "field_image,uid",
        sort: "-created",
      },
    }
  )

  return {
    props: {
      articles,
      revalidate: 60,
    },
  }
}
