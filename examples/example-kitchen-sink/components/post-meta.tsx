import Image from "next/image"

import { Post } from "types"
import { formatDate } from "lib/utils"

type PostMetaProps = Pick<Post, "author" | "date">

export function PostMeta({ author, date, ...props }: PostMetaProps) {
  return (
    <div
      className="flex items-center text-sm border-separate divide-x"
      {...props}
    >
      <div className="flex items-center px-6 space-x-4">
        {author.picture && (
          <figure className="w-12 overflow-hidden rounded-full">
            <Image
              src={author.picture.url}
              alt={author.picture.alt}
              width={40}
              height={40}
              layout="responsive"
              objectFit="cover"
            />
          </figure>
        )}
        {author.name ? (
          <span className="flex font-semibold">{author.name}</span>
        ) : null}
      </div>
      <span className="px-6 text-gray-500">{formatDate(date)}</span>
    </div>
  )
}
