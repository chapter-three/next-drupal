import { GetStaticPropsResult } from "next"
import Head from "next/head"
import { DrupalNode } from "next-drupal"

import { drupal } from "../lib/drupal"

interface IndexPageProps {
  nodes: DrupalNode[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
  return (
    <>
      <Head>
        <title key="title">Next.js for Drupal | Custom Auth Example</title>
      </Head>
      <div>
        {nodes.map((node) => (
          <article data-cy="article" key={node.id}>
            <p>{node.title}</p>
          </article>
        ))}
      </div>
    </>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "fields[node--article]": "title",
      },
    }
  )

  return {
    props: {
      nodes,
    },
  }
}
