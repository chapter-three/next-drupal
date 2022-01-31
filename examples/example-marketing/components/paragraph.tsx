import { DrupalParagraph } from "next-drupal"

import { ParagraphCards } from "components/paragraph--cards"
import { ParagraphFAQ } from "components/paragraph--faq"
import { ParagraphFeature } from "components/paragraph--feature"
import { ParagraphHero } from "components/paragraph--hero"
import { ParagraphView } from "components/paragraph--view"

const paragraphTypes = {
  "paragraph--cards": ParagraphCards,
  "paragraph--faq": ParagraphFAQ,
  "paragraph--feature": ParagraphFeature,
  "paragraph--hero": ParagraphHero,
  "paragraph--view": ParagraphView,
}

export interface ParagraphProps {
  paragraph: DrupalParagraph
}

export function Paragraph({ paragraph, ...props }: ParagraphProps) {
  if (!paragraph) {
    return null
  }

  const Component = paragraphTypes[paragraph.type]

  if (!Component) {
    return null
  }

  return <Component paragraph={paragraph} {...props} />
}
