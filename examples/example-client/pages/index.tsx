import { drupal } from "lib/drupal"
import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import Link from "next/link"

interface IndexPageProps {
  articles: DrupalNode[]
}

export default function IndexPage({ articles }: IndexPageProps) {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <Link href={article.path.alias}>
            <a>{article.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IndexPageProps>> {
  const articles = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context
  )

  return {
    props: {
      articles,
    },
  }
}
