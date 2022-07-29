import Head from "next/head"
import { InferGetStaticPropsType } from "next"

import { queries } from "queries"
import { Layout } from "components/layout"
import { CardFeatured } from "components/card--featured"
import { Card } from "components/card"

export default function IndexPage({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [firstArticle, ...otherArticles] = articles

  return (
    <Layout>
      <Head>
        <title>Example Query</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>

        {otherArticles?.length ? (
          <div className="grid gap-8">
            <CardFeatured {...firstArticle} />
            <div className="grid grid-cols-2 gap-8">
              {otherArticles.map((article, index) => (
                <Card key={index} {...article} />
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
      articles: await queries.getData("articles--published"),
    },
  }
}
