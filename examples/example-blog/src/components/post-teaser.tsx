import Link from "next/link"
import { Icon } from "reflexjs"
import Image from "next/image"

import { PostMeta } from "@/components/post-meta"

export function PostTeaser({ post, ...props }) {
  return (
    <article {...props}>
      <hr my="12|16" />
      <PostMeta post={post} fontSize="sm" />
      <h2 variant="heading.h2" my="4">
        <Link href={post.path.alias} passHref>
          <a
            color="heading"
            textDecoration="none"
            _hover={{
              color: "primary",
            }}
          >
            {post.title}
          </a>
        </Link>
      </h2>
      {post.field_image?.uri && (
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${post.field_image.uri.url}`}
            width="800"
            height="450"
            layout="intrinsic"
            objectFit="cover"
          />
        </div>
      )}
      {post.body?.summary ? (
        <p variant="text.paragraph" mt="4">
          {post.body.summary}
        </p>
      ) : null}
      <Link href={post.path.alias} passHref>
        <a
          display="inline-flex"
          lineHeight="none"
          alignItems="center"
          fontSize="sm"
          color="text"
          textDecoration="none"
          _hover={{
            color: "primary",
          }}
        >
          Read more <Icon name="arrow" size="4" ml="2" />
        </a>
      </Link>
    </article>
  )
}
