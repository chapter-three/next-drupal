import Image from "next/image"
import Link from "next/link"
import { getPathsForEntityType, getEntityFromContext } from "next-drupal"
import { Layout } from "../../src/layout"

export default function BlogPostPage({ post }) {
  if (!post) return null

  return (
    <Layout>
      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>
        {post.body?.summary ? <p>{post.body.summary}</p> : null}
        <hr />
        {post.field_image?.uri && (
          <figure>
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${post.field_image.uri.url}`}
              width={800}
              height={450}
              layout="intrinsic"
              objectFit="cover"
            />
            {post.field_image.resourceIdObjMeta.alt && (
              <figcaption>{post.field_image.resourceIdObjMeta.alt}</figcaption>
            )}
          </figure>
        )}
        {post.body?.processed && (
          <div dangerouslySetInnerHTML={{ __html: post.body?.processed }} />
        )}
        <div className="py-4 flex justify-center">
          <Link href="/" passHref>
            <a>Back to home</a>
          </Link>
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "article", {
    params: {
      "fields[node--article]": "path,field_site",
    },
  })

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const post = await getEntityFromContext("node", "article", context, {
    prefix: "/blog",
    params: {
      include: "field_image,uid",
    },
    deserialize: true,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}
