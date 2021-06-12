import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"
import {
  getPathsForEntityType,
  getEntityFromContext,
  getEntityTypeFromContext,
} from "next-drupal"

import { LandingPage } from "@/components/landing-page"
import { BasicPage } from "@/components/basic-page"

interface PageProps {
  page: Record<string, any>
}

export default function Page({ page }: PageProps) {
  if (!page) return null

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      {page.type === "node--landing_page" && <LandingPage page={page} />}
      {page.type === "node--page" && <BasicPage page={page} />}
    </>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const landingPagePaths = await getPathsForEntityType("node", "landing_page")
  const basicPagePaths = await getPathsForEntityType("node", "page")

  return {
    paths: [...landingPagePaths, ...basicPagePaths],
    fallback: true,
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<PageProps>> {
  const { entity } = await getEntityTypeFromContext(context)

  const page =
    entity.bundle === "landing_page"
      ? await getEntityFromContext("node", "landing_page", context, {
          params: {
            include:
              "field_sections,field_sections.field_media.field_media_image,field_sections.field_items,field_sections.field_reusable_paragraph.paragraphs.field_items",
          },
        })
      : await getEntityFromContext("node", "page", context)

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
