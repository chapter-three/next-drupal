import Head from "next/head"
import { GetStaticPropsResult } from "next"

import { queries } from "lib/queries"
import { Layout } from "components/layout"
import { Card, CardProps } from "components/card"
import { CardFeatured } from "components/card--featured"

interface IndexPageProps {
  articles: CardProps[]
}

export default function IndexPage({ articles }: IndexPageProps) {
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

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  return {
    props: {
      articles: await queries.getData("articles--published"),
    },
  }
}
