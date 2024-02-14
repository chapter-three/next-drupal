import Image from "next/image"
import { Link } from "@/components/navigation/Link"
import { absoluteUrl, formatDate } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface ArticleTeaserProps {
  node: DrupalNode
}

export function ArticleTeaser({ node, ...props }: ArticleTeaserProps) {
  return (
    <article {...props}>
      <Link href={node.path.alias} className="no-underline hover:text-blue-600">
        <h2 className="mb-4 text-4xl font-bold">{node.title}</h2>
      </Link>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.field_image && (
        <figure className="my-4">
          <Image
            src={absoluteUrl(node.field_image.uri.url)}
            width={768}
            height={480}
            alt={node.field_image.resourceIdObjMeta.alt}
          />
        </figure>
      )}
      <Link
        href={node.path.alias}
        className="inline-flex items-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-100"
      >
        Read article
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
      </Link>
    </article>
  )
}
