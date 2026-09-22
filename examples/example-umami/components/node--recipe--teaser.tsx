import { DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"
import Link from "next/link"

import { MediaImage } from "components/media--image"

interface NodeRecipeTeaserProps {
  node: DrupalNode
}

export function NodeRecipeTeaser({ node, ...props }: NodeRecipeTeaserProps) {
  const { t } = useTranslation()

  return (
    <article
      className="relative flex flex-col p-4 space-y-4 overflow-hidden bg-white border border-border group"
      {...props}
    >
      <h2 className="flex-1 font-serif text-2xl">{node.title}</h2>
      {node.field_difficulty && (
        <p className="text-sm capitalize text-gray-darker">
          <span className="font-semibold">{t("difficulty")}:</span>{" "}
          {node.field_difficulty}
        </p>
      )}
      <MediaImage media={node.field_media_image} width={335} height={225} />
      <Link
        href={node.path.alias}
        passHref
        className="inline-flex items-center uppercase hover:underline text-link"
      >
        {t("view-recipe")}
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
      </Link>
    </article>
  )
}
