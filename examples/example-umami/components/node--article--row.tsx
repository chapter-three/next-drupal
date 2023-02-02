import { DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"

import { formatDate } from "lib/utils"
import { MediaImage } from "components/media--image"

interface NodeArticleRowProps {
  node: DrupalNode
}

export function NodeArticleRow({ node, ...props }: NodeArticleRowProps) {
  const { t } = useTranslation()
  const router = useRouter()

  async function handleDelete() {
    if (!window?.confirm(t("are-you-use-you-want-to-delete-this-article"))) {
      return
    }

    const response = await fetch(`/api/articles/${node.id}`, {
      method: "DELETE",
    })

    if (response?.ok) {
      router.reload()
    }
  }

  return (
    <article
      className="relative grid grid-cols-[120px_1fr] items-start gap-4 p-4 overflow-hidden bg-white border border-border group"
      {...props}
    >
      <MediaImage media={node.field_media_image} width={115} height={75} />
      <div className="flex items-start justify-between text-text">
        <div>
          <h2 className="flex-1 font-serif text-xl">{node.title}</h2>
          <p className="text-sm text-gray">
            {formatDate(node.created)} -{" "}
            {node.status ? t("published") : t("draft")}
          </p>
        </div>
        <button
          onClick={() => handleDelete()}
          className="px-2 py-1 text-white rounded-md hover:bg-error bg-error/80"
        >
          {t("delete")}
        </button>
      </div>
    </article>
  )
}
