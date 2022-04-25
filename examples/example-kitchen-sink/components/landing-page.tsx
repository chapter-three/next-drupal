import React from "react"

import { LandingPage, PageSection } from "types"
import { PageHeader } from "components/page-header"
import { RecipesView } from "components/recipes-view"
import { Feature } from "./feature"

interface LandingPageProps {
  page: LandingPage
}

export function LandingPage({ page, ...props }: LandingPageProps) {
  return (
    <article {...props}>
      {page.sections?.map((section) => (
        <LandingPageSection key={section?.id} section={section} />
      ))}
    </article>
  )
}

interface LandingPageSectionProps {
  section: PageSection
}

export function LandingPageSection({ section }: LandingPageSectionProps) {
  if (section.type === "page_header") {
    return <PageHeader {...section} />
  }

  if (section.type === "view") {
    if (section.view.id === "recipes--all") {
      return <RecipesView {...section} />
    }
  }

  if (section.type === "feature") {
    return <Feature {...section} />
  }

  if (section.type === "video") {
    return (
      <video controls autoPlay muted>
        <source src={section.video} type="video/mp4" />
      </video>
    )
  }

  return null
}
