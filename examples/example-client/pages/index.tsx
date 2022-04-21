import { drupal } from "lib/drupal"
import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import Link from "next/link"

interface IndexPageProps {
  articles: DrupalNode[]
}

export default function IndexPage({ articles }: IndexPageProps) {
  return (
    <div className="max-w-3xl py-10 mx-auto prose">
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={article.path.alias}>
              <a>{article.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
