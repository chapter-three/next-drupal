import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next"
import Head from "next/head"
import {
  getPathsFromContext,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"

import { LandingPage } from "@/components/landing-page"
import { BasicPage } from "@/components/basic-page"

/* eslint-disable  @typescript-eslint/no-explicit-any */
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

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const basicPagePaths = await getPathsFromContext("node--page", context)
  const landingPagePaths = await getPathsFromContext(
    "node--landing_page",
    context
  )

  return {
    paths: [...basicPagePaths, ...landingPagePaths],
    fallback: true,
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<PageProps>> {
  const type = await getResourceTypeFromContext(context)

  if (!type) {
    return {
      notFound: true,
    }
  }

  const params =
    type === "node--landing_page"
      ? {
          include:
            "field_sections,field_sections.field_media.field_media_image,field_sections.field_items,field_sections.field_reusable_paragraph.paragraphs.field_items",
        }
      : {}

  const page = await getResourceFromContext(type, context, {
    params,
  })

  if (!page?.status) {
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
