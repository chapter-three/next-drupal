import { getEntitiesFromContext } from "next-drupal"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export default function BlogPage({ articles }) {
  return (
    <Layout>
      <NextSeo title="Blog" />
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
      sort: "-created",
    },
  })

  return {
    props: {
      articles: articles,
    },
    revalidate: 1,
  }
}
