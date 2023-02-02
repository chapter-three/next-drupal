import { LandingPage } from "types"
import { Sections } from "components/sections"

interface LandingPageProps {
  page: LandingPage
}

export function LandingPage({ page }: LandingPageProps) {
  return (
    <article>
      <h1>{page.title}</h1>
      <Sections sections={page.sections} />
    </article>
  )
}
