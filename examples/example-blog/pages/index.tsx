import Head from "next/head"
import { getResourceCollectionFromContext } from "next-drupal"

import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export default function IndexPage({ articles }) {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <div variant="container.sm" py="10|12">
        <h1 variant="heading.h1">Latest Articles.</h1>
        {articles?.length ? (
          articles.map((article) => (
            <PostTeaser key={article.id} post={article} />
          ))
        ) : (
          <p mt="8">No posts found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const entities = await getResourceCollectionFromContext(
    "node--article",
    context,
    {
      params: {
        "filter[status]": "1",
        include: "field_image, uid",
        sort: "-created",
      },
    }
  )

  const articles = entities.filter((entity) =>
    entity.field_site.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  )

  return {
    props: {
      articles,
    },
    revalidate: 1,
  }
}
