import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { getBlock } from "lib/get-block"
import { getMenu } from "lib/get-menu"
import { Layout, LayoutProps } from "components/layout"

interface ArticleNodePageProps extends LayoutProps {
  article: DrupalNode
}

export default function ArticleNodePage({
  menus,
  blocks,
  article,
}: ArticleNodePageProps) {
  return (
    <Layout menus={menus} blocks={blocks}>
      <h1>{article.title}</h1>
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  const paths = await drupal.getStaticPathsFromContext("node--article", context)

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ArticleNodePageProps>> {
  const article = await drupal.getResourceFromContext<DrupalNode>(
    "node--article",
    context
  )

  return {
    props: {
      article,
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
