import { getPathsForEntityType, getEntityFromContext } from "next-drupal"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "reflexjs"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"
import { PostMeta } from "@/components/post-meta"

export default function BlogPostPage({ post }) {
  if (!post) return null

  return (
    <Layout>
      <NextSeo title={post.title} />
      <div variant="container.sm" py="4|10|12">
        <article>
          <h1 variant="heading.title">{post.title}</h1>
          {post.body?.summary ? (
            <p variant="text.lead" mt="4">
              {post.body.summary}
            </p>
          ) : null}
          <PostMeta post={post} />
          <hr />
          {post.field_image?.uri && (
            <div>
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${post.field_image.uri.url}`}
                width={800}
                height={450}
                layout="intrinsic"
                objectFit="cover"
              />
              {post.field_image.resourceIdObjMeta.alt && (
                <p variant="text.sm" textAlign="center">
                  {post.field_image.resourceIdObjMeta.alt}
                </p>
              )}
            </div>
          )}
          {post.body?.processed && (
            <div
              dangerouslySetInnerHTML={{ __html: post.body?.processed }}
              sx={{
                p: {
                  variant: "text.paragraph",
                },
              }}
            />
          )}
          <Link href="/" passHref>
            <a
              display="inline-flex"
              mt="8"
              alignItems="center"
              color="primary"
              textDecoration="none"
              _hover={{
                textDecoration: "underline",
              }}
            >
              <Icon name="arrow" size="4" transform="rotate(180deg)" mr="2" />
              Back to blog
            </a>
          </Link>
        </article>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "article", {
    params: {
      "fields[node--article]": "path,field_site",
    },
    filter: (entity) =>
      entity.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID),
  })

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const entity = await getEntityFromContext("node", "article", context, {
    prefix: "/blog",
    params: {
      include: "field_image, uid",
    },
    deserialize: true,
  })

  if (
    !entity ||
    !entity.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post: entity,
    },
    revalidate: 1,
  }
}
