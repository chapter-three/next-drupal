import Image from "next/image"

import { FormattedText } from "components/formatted-text"
import { ShareLinks } from "components/share-links"
import { PostMeta } from "./post-meta"
import { Post } from "types"

interface PostPageProps {
  post: Post
}

export function PostPage({ post }: PostPageProps) {
  return (
    <article className="container flex flex-col px-8 mx-auto space-y-12">
      <div className="pt-12 space-y-8 text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-center">
          {post.title}
        </h1>
        <div className="flex justify-center w-full">
          <PostMeta author={post.author} date={post.date} />
        </div>
      </div>
      {post.image && (
        <figure className="overflow-hidden rounded-3xl">
          <Image
            src={post.image.url}
            alt={post.image.alt}
            width={1280}
            height={600}
            layout="responsive"
            objectFit="cover"
          />
        </figure>
      )}
      <div className="grid max-w-5xl grid-cols-4 gap-12 px-10 py-8 mx-auto">
        <div className="col-span-3 prose text-gray-500 max-w-none">
          {post.body && <FormattedText text={post.body} />}
        </div>
        <div className="flex justify-center">
          <ShareLinks title={post.title} href={post.url} />
        </div>
      </div>
    </article>
  )
}
