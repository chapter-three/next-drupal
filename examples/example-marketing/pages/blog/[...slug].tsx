import Image from "next/image"
import Head from "next/head"
import { getPathsFromContext, getResourceFromContext } from "next-drupal"

import { PostMeta } from "@/components/post-meta"

export default function BlogPostPage({ post, preview }) {
  if (!post) return null

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div variant="container" py="4">
        {preview && <p>This is preview</p>}
        <article>
          <div display="flex" flexDirection="column">
            {post.field_image?.uri && (
              <div rounded="sm" overflow="hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${post.field_image.uri.url}`}
                  width={1200}
                  height={600}
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
                    variant: "text",
                    fontSize: "xl",
                    my: 8,
                    lineHeight: 8,
                  },
                }}
              />
            )}
          </div>
        </article>
      </div>
    </>
  )
}

export async function getStaticPaths(context) {
  let paths = await getPathsFromContext("node--article", context, {
    params: {
      "filter[status]": "1",
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
    !post.status ||
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
