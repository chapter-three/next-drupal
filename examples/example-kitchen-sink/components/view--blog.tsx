import { DrupalView } from "types/drupal"

interface ViewBlogProps {
  view: DrupalView
}

export function ViewBlog({ view }: ViewBlogProps) {
  return <p>view</p>
}
