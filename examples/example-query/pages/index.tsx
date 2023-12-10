import Head from "next/head"
import { InferGetStaticPropsType } from "next"

import { queries } from "queries"
import { Layout } from "components/layout"
import { CardFeatured } from "components/card--featured"
import { Card } from "components/card"

export default function IndexPage({
  menu,
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [firstArticle, ...otherArticles] = articles

  return (
    <Layout menu={menu}>
      <Head>
        <title key="title">Example Query</title>
        <meta
          key="description"
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
        {articles?.length ? (
          <div className="grid gap-8">
            <CardFeatured
              title={firstArticle.title}
              media={{
                type: "media--image",
                id: firstArticle.id,
                url: firstArticle.image.url,
                alt: firstArticle.image.alt,
                width: 900,
                height: 450,
              }}
              url={firstArticle.url}
            />
            <div className="grid gap-8 sm:grid-cols-2">
              {otherArticles.map((article, index) => (
                <Card
                  key={index}
                  title={article.title}
                  media={{
                    type: "media--image",
                    id: article.id,
                    url: article.image.url,
                    alt: article.image.alt,
                    width: 430,
                    height: 280,
                  }}
                  url={article.url}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="py-4">No articles found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      menu: await queries.getData("menu", { name: "main" }),
      articles: await queries.getData("list--articles--published"),
    },
  }
}
