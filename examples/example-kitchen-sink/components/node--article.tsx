import Image from "next/image"
import Link from "next/link"

import { formatDate } from "lib/format-date"
import { FormattedText } from "./formatted-text"
import { ShareLinks } from "./share-links"
import { DrupalNode } from "next-drupal"

interface NodeArticleProps {
  node: DrupalNode
}

export function NodeArticle({ node, ...props }: NodeArticleProps) {
  return (
    <article
      className="container flex flex-col px-8 mx-auto space-y-12"
      {...props}
    >
      <div className="pt-12 space-y-8 text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-center">
          {node.title}
        </h1>
        <div className="flex justify-center w-full">
          <NodeMeta node={node} />
        </div>
      </div>
      {node.field_image?.uri && (
        <figure className="overflow-hidden rounded-3xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
            width={1280}
            height={600}
            layout="responsive"
            objectFit="cover"
            alt={node.field_image.resourceIdObjMeta.alt}
          />
        </figure>
      )}
      <div className="grid max-w-5xl grid-cols-4 gap-12 px-10 py-8 mx-auto">
        <div className="col-span-3 prose text-gray-500 max-w-none">
          {node.body?.processed && <FormattedText text={node.body.processed} />}
        </div>
        <div className="flex justify-center">
          <ShareLinks title={node.title} href={node.path.alias} />
        </div>
      </div>
    </article>
  )
}

export function NodeArticleTeaser({ node, ...props }) {
  return (
    <article {...props}>
      <Link href={node.path.alias} passHref>
        <a className="no-underline hover:text-blue-600">
          <h2 className="mb-4 text-4xl font-bold">{node.title}</h2>
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
      {node.body?.summary && (
        <p className="mt-6 font-serif text-xl leading-loose">
          {node.body.summary}
        </p>
      )}
    </article>
  )
}

function NodeMeta({ node, ...props }) {
  return (
    <div
      className="flex items-center text-sm border-separate divide-x"
      {...props}
    >
      <div className="flex items-center px-6 space-x-4">
        {node.uid?.user_picture && (
          <figure className="w-12 overflow-hidden rounded-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.uid.user_picture.uri.url}`}
              width={40}
              height={40}
              layout="responsive"
              objectFit="cover"
            />
          </figure>
        )}
        {node.uid?.display_name ? (
          <span className="flex font-semibold">{node.uid.display_name}</span>
        ) : null}
      </div>
      <span className="px-6 text-gray-500">{formatDate(node.created)}</span>
    </div>
  )
}
