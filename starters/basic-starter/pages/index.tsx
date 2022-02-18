import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode, getResourceCollectionFromContext } from "next-drupal"

import { NodeArticleTeaser } from "@/components/node-article"
import { Layout } from "@/components/layout"

interface IndexPageProps {
  nodes: DrupalNode[]
}

export default function IndexPage({ nodes }: IndexPageProps) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>

        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeArticleTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {
  const nodes = await getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: {
        include: "field_image,uid",
        sort: "-created",
      },
    }
  )

  return {
    props: {
      nodes,
    },
    revalidate: 10,
  }
}
