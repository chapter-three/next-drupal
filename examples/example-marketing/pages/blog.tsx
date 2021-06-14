import Head from "next/head"
import { getResourceCollectionFromContext } from "next-drupal"

import { NodeArticleTeaser } from "@/components/node-article"
import { useRouter } from "next/router"

export default function BlogPage({ articles }) {
  const { locale } = useRouter()
  const title = locale === "en" ? "Latest Articles." : "Últimas Publicaciones."
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">{title}</h1>
        {articles.length ? (
          <div display="grid" col="1|1|2" gap="20">
            {articles.map((article) => (
              <NodeArticleTeaser key={article.id} node={article} />
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
