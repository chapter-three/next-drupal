import { getEntitiesFromContext } from "next-drupal"
import Link from "next/link"
import Image from "next/image"
import { Layout } from "../src/layout"
import { formatDate } from "../src/utils/format-date"

export default function IndexPage({ articles }) {
  return (
    <Layout>
      <h1 className="text-6xl font-bold">Latest Articles.</h1>
      {articles?.length ? (
        articles.map((article) => (
          <article key={article.id} className="prose py-10">
            <h2>
              <Link href={article.path.alias} passHref>
                <a className="no-underline">{article.title}</a>
              </Link>
            </h2>
            <div className="mb-4">
              {article.uid?.display_name ? (
                <span>
                  Posted by <strong>{article.uid?.display_name}</strong>
                </span>
              ) : null}
              <span> - {formatDate(article.created)}</span>
            </div>
            {article.field_image?.uri && (
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
                  width={800}
                  height={450}
                  layout="intrinsic"
                  objectFit="cover"
                />
              </div>
            )}
            <p>{article.body.summary}</p>
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
  })

  return {
    props: {
      articles,
    },
  }
}
