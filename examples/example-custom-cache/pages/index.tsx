import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import Link from "next/link"

import { drupal } from "lib/drupal"
import { getMenu } from "lib/get-menu"
import { getBlock } from "lib/get-block"
import { Layout, LayoutProps } from "components/layout"

interface IndexPageProps extends LayoutProps {
  articles: DrupalNode[]
}

export default function IndexPage({ menus, blocks, articles }: IndexPageProps) {
  return (
    <Layout menus={menus} blocks={blocks}>
      <div>
        <h1>Articles</h1>
        {articles.map((article) => (
          <article key={article.id}>
            <Link href={article.path.alias} passHref>
              <a>{article.title}</a>
            </Link>
          </article>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const articles = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "fields[node--article]": "title,path",
      },
    }
  )

  return {
    props: {
      articles,
      menus: {
        main: await getMenu("main"),
      },
      blocks: {
        copyright: await getBlock(
          "block_content--basic",
          "42487873-3aad-44ab-8dd6-c2fb0d82bb8f"
        ),
      },
    },
  }
}
