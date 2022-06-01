import Link from "next/link"
import { DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"
import classNames from "classnames"

import { MediaImage } from "components/media--image"

interface NodeArticleCardAltProps extends React.HTMLProps<HTMLElement> {
  node: DrupalNode
}

export function NodeArticleCardAlt({
  node,
  className,
  ...props
}: NodeArticleCardAltProps) {
  const { t } = useTranslation()

  return (
    <article
      className={classNames(
        "relative flex flex-col p-4 space-y-4 overflow-hidden bg-white border border-border group",
        className
      )}
      {...props}
    >
      <div className="flex flex-col flex-1 space-y-4">
        <h2 className="flex-1 font-serif text-2xl">{node.title}</h2>
        <Link href={node.path.alias} passHref>
          <a className="inline-flex items-center uppercase hover:underline text-link">
            {t("view-article")}
            <svg
              className="w-5 h-5 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </Link>
      </div>
      <MediaImage media={node.field_media_image} width={335} height={225} />
    </article>
  )
}
