import Head from "next/head"
import { getResourceCollectionFromContext } from "next-drupal"

import { PostTeaser } from "@/components/post-teaser"

export default function BlogPage({ articles }) {
  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">Latest Articles.</h1>
        {articles.length ? (
          <div display="grid" col="1|1|2" gap="20">
            {articles.map((article) => (
              <PostTeaser key={article.id} post={article} />
            ))}
          </div>
        ) : (
          <p mt="6">No posts found</p>
        )}
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const entities = await getResourceCollectionFromContext(
    "node--article",
    context,
    {
      params: {
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
    revalidate: 60,
  }
}
