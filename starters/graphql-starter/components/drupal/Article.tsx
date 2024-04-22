import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { DrupalArticle } from "@/types"

interface ArticleProps {
  node: DrupalArticle
}

export function Article({ node, ...props }: ArticleProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      <div className="mb-4 text-gray-600">
        {node.author?.name ? (
          <span>
            Posted by <span className="font-semibold">{node.author.name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created.time)}</span>
      </div>
      {node.image && (
        <figure>
          <Image
            src={node.image.url}
            width={768}
            height={400}
            alt=""
            priority
          />
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
