import { DrupalNode } from "next-drupal"

import { Paragraph } from "components/paragraph"

interface NodeLandingPageProps {
  node: DrupalNode
}

export function NodeLandingPage({ node, ...props }: NodeLandingPageProps) {
  return (
    <article {...props}>
      {node.field_sections?.map((paragraph) => (
        <Paragraph key={paragraph.id} paragraph={paragraph} />
      ))}
    </article>
  )
}
