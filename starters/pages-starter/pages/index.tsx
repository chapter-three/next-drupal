import Head from "next/head"
import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { Layout } from "@/components/Layout"
import { drupal } from "@/lib/drupal"
import type { InferGetStaticPropsType, GetStaticProps } from "next"
import type { DrupalNode } from "next-drupal"

export const getStaticProps = (async (context) => {
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
      },
    }
  )

  return {
    props: {
      nodes,
    },
  }
}) satisfies GetStaticProps<{
  nodes: DrupalNode[]
}>

export default function Home({
  nodes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
          key="description"
        />
      </Head>
      <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
      {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <ArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No nodes found</p>
      )}
    </Layout>
  )
}
