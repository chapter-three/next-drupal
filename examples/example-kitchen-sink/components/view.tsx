import { DrupalView } from "types/drupal"
import { ViewBlog } from "components/view--blog"

const views = {
  "foodieland_blog--all": ViewBlog,
}

export interface ViewProps {
  view: DrupalView
}

export function View({ view, ...props }: ViewProps) {
  const Component = views[view.meta.id]

  if (!Component) {
    return null
  }

  return <Component view={view} {...props} />
}
