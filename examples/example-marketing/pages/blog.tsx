import { getEntitiesFromContext } from "next-drupal"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export default function BlogPage({ articles }) {
  return (
    <Layout>
      <NextSeo title="Blog" />
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">Latest Articles.</h1>
        {articles.length ? (
          <div display="grid" col="1|1|2|3" gap="20">
            {articles.map((article) => (
              <PostTeaser key={article.id} post={article} />
            ))}
          </div>
        ) : (
          <p mt="6">No posts found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const articles = await getEntitiesFromContext("node", "article", context, {
    params: {
      include: "field_image, uid",
      sort: "-created",
    },
    filter: (entity) =>
      entity.field_site.some(({ id }) => id === process.env.DRUPAL_SITE_ID),
  })

  return {
    props: {
      articles: articles,
    },
    revalidate: 1,
  }
}
