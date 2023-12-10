import { GetStaticPropsResult } from "next"
import Head from "next/head"
import { DrupalNode } from "next-drupal"

import { drupal } from "../lib/drupal"

interface IndexPageProps {
  publishedNodes: DrupalNode[]
  allNodes: DrupalNode[]
}

export default function IndexPage({
  publishedNodes,
  allNodes,
}: IndexPageProps) {
  return (
    <>
      <Head>
        <title key="title">Next.js for Drupal | Custom Auth Example</title>
      </Head>
      <div>
        <dl>
          <dt>All Nodes</dt>
          <dd data-cy="all-nodes">{allNodes.length}</dd>

          <dt>Published Nodes</dt>
          <dd data-cy="published-nodes">{publishedNodes.length}</dd>
        </dl>
      </div>
    </>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const params = {
    "fields[node--article]": "title,status",
  }

  const publishedNodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params,
    }
  )

  // We fetch unpublished nodes using authentication.
  // The supplied user for auth has access to view unpublished nodes.
  const allNodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params,
      withAuth: true,
    }
  )

  return {
    props: {
      publishedNodes,
      allNodes,
    },
  }
}
