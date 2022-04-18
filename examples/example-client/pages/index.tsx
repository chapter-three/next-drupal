import { drupal } from "lib/drupal"
import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"

interface IndexPageProps {
  article: DrupalNode
}

export default function IndexPage({ article }: IndexPageProps) {
  return <h1>{article.title}</h1>
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IndexPageProps>> {
  const article = await drupal.getResource<DrupalNode>(
    "node--article",
    "090fbb9e-55b5-4e93-b755-6e0d36426188"
  )

  return {
    props: {
      article,
    },
  }
}
