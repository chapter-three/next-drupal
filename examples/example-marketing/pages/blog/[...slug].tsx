import {
  getPathsForEntityType,
  getEntityFromContext,
  deserialize,
} from "next-drupal"
import Image from "next/image"
import { NextSeo } from "next-seo"

import { Layout } from "@/components/layout"
import { PostMeta } from "@/components/post-meta"

export default function BlogPostPage({ post }) {
  if (!post) return null

  return (
    <Layout>
      <NextSeo title={post.title} />
      <div variant="container" py="4">
        <article>
          <div display="flex" flexDirection="column">
            {post.field_image?.uri && (
              <div rounded="sm" overflow="hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${post.field_image.uri.url}`}
                  width="1200"
                  height="600"
                  layout="intrinsic"
                  objectFit="cover"
                />
              </div>
            )}
            <div
              flex="1"
              boxShadow="xl"
              p="10"
              mt="-20"
              mx="10"
              position="relative"
              zIndex="100"
              bg="background"
            >
              <h1 variant="heading.title">{post.title}</h1>
              <PostMeta post={post} />
            </div>
          </div>

          <div variant="container.md" pt="12">
            {post.body?.summary ? (
              <p variant="text.lead" mt="4">
                {post.body.summary}
              </p>
            ) : null}

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
          </div>
        </article>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "article", {
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
