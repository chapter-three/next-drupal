import { DrupalNode } from "next-drupal"

import { Paragraph } from "components/paragraph"

interface NodeLandingPage {
  node: DrupalNode
  viewMode?: string
}

export function NodeLandingPage({ node }: NodeLandingPage) {
  if (!node.field_sections?.length) return null

  return node.field_sections.map((paragraph) => {
    if (paragraph.type === "paragraph--from_library") {
      paragraph = paragraph.field_reusable_paragraph.paragraphs
    }

    return <Paragraph key={paragraph.id} paragraph={paragraph} />
  })
}
