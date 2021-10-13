import Head from "next/head"
import { getResourceCollectionFromContext, DrupalNode } from "next-drupal"

import { NodeArticleTeaser } from "@/nodes/node-article"
import { useRouter } from "next/router"

export default function BlogPage({ nodes }) {
  const { locale } = useRouter()
  const title = locale === "en" ? "Latest Articles." : "Últimas Publicaciones."

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">{title}</h1>
        {nodes.length ? (
          <div display="grid" col="1|1|2" gap="20">
            {nodes.map((article) => (
              <NodeArticleTeaser key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p mt="6">No posts found</p>
        )}
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const entities = await getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: {
        "filter[status]": "1",
        include: "field_image, uid",
        sort: "-created",
      },
    }
  )

  // The article content type uses a "field_site" entity_reference field
  // to set which site to publish to.
  // Here we filter out nodes that are not published for this site.
  const nodes = entities.filter((entity) =>
    entity.field_site.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  )

  return {
    props: {
      nodes,
    },
    revalidate: 1,
  }
}
