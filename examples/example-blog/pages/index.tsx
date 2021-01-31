import { deserialize, getEntitiesFromContext } from "next-drupal"
import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export default function IndexPage({ articles }) {
  return (
    <Layout>
      <div variant="container.sm" py="10|12">
        <h1 variant="heading.h1">Latest Articles.</h1>
        {articles.length ? (
          articles.map((article) => (
            <PostTeaser key={article.id} post={article} />
          ))
        ) : (
          <p textAlign="center">No posts found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const articles = await getEntitiesFromContext("node", "article", context, {
    params: {
      include: "field_image, uid",
    },
  })

  return {
    props: {
      articles: deserialize(articles),
    },
    revalidate: 1,
  }
}
