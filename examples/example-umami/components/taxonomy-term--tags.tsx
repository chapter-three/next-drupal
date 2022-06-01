import * as React from "react"
import { DrupalNode, DrupalTaxonomyTerm } from "next-drupal"
import { useTranslation } from "next-i18next"

import { Breadcrumbs } from "components/breadcrumbs"
import { PageHeader } from "components/page-header"
import { NodeRecipeTeaser } from "components/node--recipe--teaser"
import { NodeArticleCard } from "components/node--article--card"

export interface TaxonomyTermTagsProps {
  term: DrupalTaxonomyTerm
  additionalContent: {
    termContent: DrupalNode[]
  }
}

export function TaxonomyTermTags({
  term,
  additionalContent,
}: TaxonomyTermTagsProps) {
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
            title: term.name,
          },
        ]}
      />
      <PageHeader heading={term.name} />
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {additionalContent?.termContent.map((node) => (
          <React.Fragment key={node.id}>
            {node.type === "node--recipe" && <NodeRecipeTeaser node={node} />}
            {node.type === "node--article" && <NodeArticleCard node={node} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
