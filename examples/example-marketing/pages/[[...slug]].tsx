import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { getPathsForEntityType, getEntityFromContext } from "next-drupal"

interface LandingPageProps {
  page: Record<string, any>
}

export default function LandingPage({ page }: LandingPageProps) {
  if (!page) return null

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
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
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsForEntityType("node", "landing_page"),
    fallback: true,
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<LandingPageProps>> {
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
    revalidate: 60,
  }
}
