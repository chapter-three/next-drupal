import {
  getPathsForEntityType,
  getEntityFromContext,
  deserialize,
} from "next-drupal"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"

export default function BasicPage({ page }) {
  if (!page) return null

  return (
    <Layout>
      <NextSeo title={page.title} />
      <div variant="container.sm" py="10|12">
        <h1 variant="heading.h1">{page.title}</h1>
        {page.body && (
          <div
            dangerouslySetInnerHTML={{ __html: page.body.processed }}
            sx={{
              p: {
                variant: "text.paragraph",
              },
            }}
          />
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "page")

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const entity = await getEntityFromContext("node", "page", context)

  if (!entity) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page: deserialize(entity),
    },
    revalidate: 1,
  }
}
