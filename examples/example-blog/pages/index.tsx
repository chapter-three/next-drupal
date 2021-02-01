import { NextSeo } from "next-seo"
import { getEntitiesFromContext } from "next-drupal"

import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export default function IndexPage({ articles }) {
  return (
    <Layout>
      <NextSeo title="Blog" />
      <div variant="container.sm" py="10|12">
        <h1 variant="heading.h1">Latest Articles.</h1>
        {articles?.length ? (
          articles.map((article) => (
            <PostTeaser key={article.id} post={article} />
          ))
        ) : (
          <p mt="8">No articles found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  let articles = await getEntitiesFromContext("node", "article", context, {
    params: {
      include: "field_image, uid",
      sort: "-created",
    },
    deserialize: true,
  })

  // Filter articles for current site.
  articles = articles.filter((article) =>
    article.field_site.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  )

  return {
    props: {
      articles: articles,
    },
    revalidate: 1,
  }
}
