import Image from "next/image"

import { formatDate } from "lib/utils"

export function NodeArticle({ node, ...props }) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      <div className="mb-4 text-gray-600">
        {node.author?.displayName ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.author.displayName}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.image && (
        <figure className="my-4">
          <Image
            src={node.image.url}
            width={node.image.width}
            height={node.image.height}
            layout="responsive"
            objectFit="cover"
            alt={"Alt"}
          />
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
