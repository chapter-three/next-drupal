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
        <title key="head_title">Next.js for Drupal | Custom Auth Example</title>
      </Head>
      <div>
        {nodes.map((node) => (
          <article key={node.id}>
            <p>{node.title}</p>
            <p data-cy="image">{node.fieldImage?.filename}</p>
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
        "fields[node--article]": "title,status,field_image",
        include: "field_image",
      },
    }
  )

  return {
    props: {
      nodes,
    },
  }
}
