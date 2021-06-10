import dynamic from "next/dynamic"
import { getPathsForEntityType, getEntityFromContext } from "next-drupal"
import { NextSeo } from "next-seo"
import { GetStaticPathsResult } from "next"

export default function LandingPage({ page }) {
  if (!page) return null

  return (
    <>
      <NextSeo title={page.title} />
      {page.type === "node--page" ? (
        <h1>{page.title}</h1>
      ) : (
        <>
          {page.field_sections?.length ? (
            <>
              {page.field_sections.map((section) => {
                if (section.type === "paragraph--from_library") {
                  section = section.field_reusable_paragraph.paragraphs
                }

                const section_type = section.type.replace("paragraph--", "")
                const Section = dynamic<{ section: unknown }>(
                  () => import(`../src/sections/${section_type}.tsx`)
                )

                return Section ? (
                  <Section key={section.id} section={section} />
                ) : null
              })}
            </>
          ) : null}
        </>
      )}
    </>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsForEntityType("node", "landing_page"),
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const page = await getEntityFromContext("node", "landing_page", context, {
    params: {
      include:
        "field_sections,field_sections.field_media.field_media_image,field_sections.field_items,field_sections.field_reusable_paragraph.paragraphs.field_items",
    },
  })

  if (!page) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page,
    },
    revalidate: 1,
  }
}
