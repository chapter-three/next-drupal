import {
  getPathsForEntityType,
  getEntityFromContext,
  deserialize,
} from "next-drupal"
import dynamic from "next/dynamic"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"

export default function BasicPage({ page }) {
  if (!page) return null

  return (
    <Layout>
      <NextSeo title={page.title} />
      {page.field_sections.length ? (
        <>
          {page.field_sections.map((section) => {
            if (section.type === "paragraph--from_library") {
              section = section.field_reusable_paragraph.paragraphs
            }

            let section_type = section.type.replace("paragraph--", "")
            const Section = dynamic<{ section: any }>(
              () => import(`../src/sections/${section_type}.tsx`)
            )

            return Section ? (
              <Section key={section.id} section={section} />
            ) : null
          })}
        </>
      ) : null}
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "landing_page")

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const entity = await getEntityFromContext("node", "landing_page", context, {
    params: {
      include:
        "field_sections,field_sections.field_media.field_media_image,field_sections.field_items,field_sections.field_reusable_paragraph.paragraphs.field_items",
    },
  })

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
