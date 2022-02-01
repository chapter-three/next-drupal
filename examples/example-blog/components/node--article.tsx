import Link from "next/link"
import Image from "next/image"

import { formatDate } from "lib/utils/format-date"
import { absoluteURL } from "lib/utils/absolute-url"
import { FormattedText } from "components/formatted-text"
import { NodeProps } from "components/node"

export function NodeArticle({ node, viewMode, ...props }: NodeProps) {
  if (viewMode === "teaser") {
    return <NodeArticleTeaser node={node} {...props} />
  }

  if (viewMode === "full") {
    return <NodeArticleFull node={node} {...props} />
  }

  return null
}

export function NodeArticleFull({ node, ...props }) {
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
            <FormattedText processed={node.body.processed} />
          )}
        </div>
      </div>
    </article>
  )
}

export function NodeArticleTeaser({ node, ...props }) {
  return (
    <article data-cy="node--article" {...props}>
      {node.field_image?.uri && (
        <div>
          <Image
            src={absoluteURL(node.field_image.uri.url)}
            width={800}
            height={450}
            layout="intrinsic"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <h2 className="my-4 text-2xl font-semibold md:text-3xl">
        <Link href={node.path?.alias} passHref>
          <a className="hover:text-blue-500">{node.title}</a>
        </Link>
      </h2>
      <div data-cy="node--meta" className="text-gray-600">
        {node.uid?.field_name ? (
          <span>
            Posted by <strong>{node.uid?.field_name}</strong>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.body?.summary ? (
        <p className="mt-4 leading-relaxed text-gray-600">
          {node.body.summary}
        </p>
      ) : null}
      <Link href={node.path.alias} passHref>
        <a className="flex items-center mt-4 text-sm hover:text-blue-500">
          Read more
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 ml-2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </Link>
    </article>
  )
}
