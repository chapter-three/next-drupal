import { DrupalNode } from "next-drupal"

import { Breadcrumbs } from "components/breadcrumbs"
import { useTranslation } from "next-i18next"
import { FormattedText } from "./formatted-text"

interface NodePageProps {
  node: DrupalNode
}

export function NodePage({ node }: NodePageProps) {
  const { t } = useTranslation()

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          {
            title: t("home"),
            url: "/",
          },
          {
            title: node.title,
          },
        ]}
      />
      <article className="bg-white border text-text p-9 border-border">
        <h1 className="font-serif text-2xl leading-tight lg:text-4xl">
          {node.title}
        </h1>
        <div className="mt-4 prose prose-a:text-link max-w-none text-text">
          {node.body?.processed && <FormattedText text={node.body.processed} />}
        </div>
      </article>
    </div>
  )
}
