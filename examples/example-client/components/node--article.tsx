import Image from "next/image"

import { formatDate, absoluteURL } from "lib/utils"

export function NodeArticle({ node, ...props }) {
  return (
    <article data-cy="node--article" {...props}>
      <div className="container max-w-3xl px-6 mx-auto my-10 md:my-18">
        <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-5xl">
          {node.title}
        </h1>
        <div className="prose">
          <div data-cy="node--meta" className="text-gray-600">
            {node.uid?.field_name ? (
              <span>
                Posted by <strong>{node.uid?.field_name}</strong>
              </span>
            ) : null}
            <span> - {formatDate(node.created)}</span>
          </div>
          {node.body?.summary ? <p>{node.body.summary}</p> : null}
          {node.field_image?.uri && (
            <Image
              src={absoluteURL(node.field_image.uri.url)}
              width={1200}
              height={600}
              layout="intrinsic"
              objectFit="cover"
              className="rounded-lg"
            />
          )}
          {node.body?.processed && (
            <div dangerouslySetInnerHTML={{ __html: node.body.processed }} />
          )}
        </div>
      </div>
    </article>
  )
}
