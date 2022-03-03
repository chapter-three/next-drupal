import * as React from "react"
import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import {
  deserialize,
  DrupalNode,
  getResourceCollectionFromContext,
  JsonApiResponse,
} from "next-drupal"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"

import { getMenus } from "lib/get-menus"
import { Layout, LayoutProps } from "components/layout"
import { Pager, PagerProps } from "components/pager"
import { Node } from "components/node"
import { Meta } from "components/meta"

export const NUMBER_OF_POSTS_PER_PAGE = 2

export interface BlogPageProps extends LayoutProps {
  page: Pick<PagerProps, "current" | "total">
  nodes: DrupalNode[]
}

export default function BlogPage({ nodes, menus, page }: BlogPageProps) {
  return (
    <Layout menus={menus}>
      <Meta title="Blog." />
      <div className="container px-6 pt-10 mx-auto md:py-20">
        <h1 className="mb-10 text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
          Blog.
        </h1>
        {nodes.length ? (
          <div className="grid grid-flow-row gap-20">
            {nodes.map((article) => (
              <Node viewMode="teaser" key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p className="py-6">No posts found</p>
        )}
        {page ? (
          <Pager
            current={page.current}
            total={page.total}
            href={(page) => (page === 0 ? `/` : `/page/${page}`)}
            className="py-8 mt-8"
          />
        ) : null}
      </div>
    </Layout>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  // Use SSG for the first pages, then fallback to SSR for other pages.
  const paths = Array(5)
    .fill(0)
    .map((_, page) => ({
      params: {
        page: `${page + 1}`,
      },
    }))

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<BlogPageProps>> {
  const current = parseInt(context.params.page)

  const params = new DrupalJsonApiParams()
    .addFilter(
      "field_site.meta.drupal_internal__target_id",
      process.env.DRUPAL_SITE_ID
    )
    .addInclude(["uid", "field_image"])
    .addFields("node--article", [
      "title",
      "path",
      "body",
      "uid",
      "created",
      "field_image",
    ])
    .addFields("user--user", ["field_name"])
    .addFilter("status", "1")
    .addSort("created", "DESC")

  const result = await getResourceCollectionFromContext<JsonApiResponse>(
    "node--article",
    context,
    {
      deserialize: false,
      params: {
        ...params.getQueryObject(),
        page: {
          limit: NUMBER_OF_POSTS_PER_PAGE,
          offset: context.params.page ? NUMBER_OF_POSTS_PER_PAGE * current : 0,
        },
      },
    }
  )

  if (!result.data?.length) {
    return {
      notFound: true,
    }
  }

  const nodes = deserialize(result) as DrupalNode[]

  return {
    props: {
      nodes,
      page: {
        current,
        total: Math.ceil(result.meta.count / NUMBER_OF_POSTS_PER_PAGE),
      },
      menus: await getMenus(context),
    },
  }
}
