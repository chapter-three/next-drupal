import { getEntitiesFromContext } from "next-drupal"
import Link from "next/link"
import Image from "next/image"

import { Layout } from "../src/layout"
import { formatDate } from "../src/utils/format-date"

export default function IndexPage({ articles }) {
  return (
    <Layout>
      <h1 variant="heading.h1" mb="10">
        Latest Articles.
      </h1>

      {articles?.length ? (
        articles.map((article) => (
          <article key={article.id} py="10">
            <Link href={article.path.alias} passHref>
              <a textDecoration="none">
                <h2 variant="heading.h3" mb="4">
                  {article.title}
                </h2>
              </a>
            </Link>
            <div mb="4" color="gray">
              {article.uid?.display_name ? (
                <span>
                  Posted by{" "}
                  <span fontWeight="semibold">{article.uid?.display_name}</span>
                </span>
              ) : null}
              <span> - {formatDate(article.created)}</span>
            </div>
            {article.field_image?.uri && (
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
                  width={640}
                  height={400}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            )}
            <p mt="6" fontFamily="serif" lineHeight="2">
              {article.body.summary}
            </p>
            <hr />
          </article>
        ))
      ) : (
        <p>No articles found</p>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const articles = await getEntitiesFromContext("node", "article", context, {
    params: {
      include: "field_image,uid",
      sort: "-created",
    },
    deserialize: true,
  })

  return {
    props: {
      articles,
      revalidate: 1,
    },
  }
}
