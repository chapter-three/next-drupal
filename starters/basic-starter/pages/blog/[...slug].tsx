import Image from "next/image"
import Link from "next/link"
import { getPathsForEntityType, getEntityFromContext } from "next-drupal"

import { Layout } from "../../src/layout"
import { formatDate } from "../../src/utils/format-date"
import { Icon } from "reflexjs"

export default function ArticlePage({ article }) {
  if (!article) return null

  return (
    <Layout>
      <article py="10">
        <h1 fontSize="5xl" lineHeight="1" mb="6">
          {article.title}
        </h1>
        <div mb="4" color="gray">
          {article.uid?.display_name ? (
            <span>
              Posted by <strong>{article.uid?.display_name}</strong>
            </span>
          ) : null}
          <span> - {formatDate(article.created)}</span>
        </div>
        <hr />
        {article.field_image?.uri && (
          <figure>
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
              width={640}
              height={400}
              layout="responsive"
              objectFit="cover"
            />
            {article.field_image.resourceIdObjMeta.alt && (
              <figcaption fontSize="sm" py="2" color="gray" textAlign="center">
                {article.field_image.resourceIdObjMeta.alt}
              </figcaption>
            )}
          </figure>
        )}
        {article.body?.processed && (
          <div
            dangerouslySetInnerHTML={{ __html: article.body?.processed }}
            py="8"
            sx={{
              p: {
                fontFamily: "serif",
                fontSize: "xl",
                my: 8,
                lineHeight: 8,
              },
            }}
          />
        )}
        <div py="6" display="flex" justifyContent="center">
          <Link href="/" passHref>
            <a variant="button.link">
              <Icon name="arrow" transform="rotate(180deg)" mr="2" />
              Back
            </a>
          </Link>
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getPathsForEntityType("node", "article"),
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const article = await getEntityFromContext("node", "article", context, {
    prefix: "/blog",
    params: {
      include: "field_image,uid",
    },
  })

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article,
      revalidate: 1,
    },
  }
}
