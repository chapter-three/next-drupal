import Image from "next/image"
import Link from "next/link"

import { formatDate } from "../../lib/format-date"

export function NodeArticle({ node, ...props }) {
  return (
    <article {...props}>
      <h1 className="text-6xl font-black mb-4 leading-tight">{node.title}</h1>
      <NodeMeta node={node} />
      {node.field_image?.uri && (
        <figure>
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
            width={768}
            height={400}
            layout="responsive"
            objectFit="cover"
            alt={node.field_image.resourceIdObjMeta.alt}
          />
          {node.field_image.resourceIdObjMeta.title && (
            <figcaption className="text-sm py-2 text-gray-600 text-center">
              {node.field_image.resourceIdObjMeta.title}
            </figcaption>
          )}
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

export function NodeArticleTeaser({ node, ...props }) {
  return (
    <article {...props}>
      <Link href={node.path.alias} passHref>
        <a className="no-underline hover:text-blue-600">
          <h2 className="text-4xl font-bold mb-4">{node.title}</h2>
        </a>
      </Link>
      <NodeMeta node={node} />
      {node.field_image?.uri && (
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
            width={768}
            height={480}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      )}
      <p className="mt-6 font-serif text-xl leading-loose">
        {node.body.summary}
      </p>
    </article>
  )
}

function NodeMeta({ node, ...props }) {
  return (
    <div className="mb-4 text-gray-600">
      {node.uid?.display_name ? (
        <span>
          Posted by{" "}
          <span className="font-semibold">{node.uid?.display_name}</span>
        </span>
      ) : null}
      <span> - {formatDate(node.created)}</span>
    </div>
  )
}
