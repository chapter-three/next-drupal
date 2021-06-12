import Image from "next/image"
import Head from "next/head"
import { getPathsFromContext, getResourceFromContext } from "next-drupal"

import { Layout } from "@/components/layout"
import { PostMeta } from "@/components/post-meta"

export default function BlogPostPage({ post }) {
  if (!post) return null

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div variant="container.sm" py="4|10|12">
        <article>
          <h1 variant="heading.h1">{post.title}</h1>
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
                  variant: "text",
                  fontFamily: "serif",
                  fontSize: "xl",
                  my: 8,
                  lineHeight: 8,
                },
              }}
            />
          )}
        </article>
      </div>
    </Layout>
  )
}

export async function getStaticPaths(context) {
  let paths = await getPathsFromContext("node--article", context, {
    params: {
      "fields[node--article]": "path,field_site",
    },
  })

  paths = paths.filter((entity) =>
    entity.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  )

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const post = await getResourceFromContext("node--article", context, {
    prefix: "/blog",
    params: {
      include: "field_image,uid",
    },
  })

  if (
    !post ||
    !post.field_site?.some(({ id }) => id === process.env.DRUPAL_SITE_ID)
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 1,
  }
}
