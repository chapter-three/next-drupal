import { DrupalParagraph } from "next-drupal"

import { ParagraphView } from "components/paragraph--view"
import { ParagraphPageTitle } from "./paragraph--page_title"

const paragraphTypes = {
  "paragraph--page_title": ParagraphPageTitle,
  "paragraph--view": ParagraphView,
}

export interface ParagraphProps {
  paragraph: DrupalParagraph
}

export function Paragraph({ paragraph, ...props }: ParagraphProps) {
  if (!paragraph) {
    return null
  }

  const Component = paragraphTypes[paragraph?.type]

  if (!Component) {
    return null
  }

  return <Component paragraph={paragraph} {...props} />
}
