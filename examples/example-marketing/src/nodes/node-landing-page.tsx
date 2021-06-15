import dynamic from "next/dynamic"

export function NodeLandingPage({ node, ...props }) {
  if (!node.field_sections?.length) return null

  return (
    <div {...props}>
      {node.field_sections.map((paragraph) => {
        if (paragraph.type === "paragraph--from_library") {
          paragraph = paragraph.field_reusable_paragraph.paragraphs
        }

        const paragraph_type = paragraph.type.replace("paragraph--", "")
        // TODO: Replace with static import.
        const Paragraph = dynamic<{ paragraph: unknown }>(
          () => import(`../paragraphs/paragraph-${paragraph_type}.tsx`)
        )

        return paragraph ? (
          <Paragraph key={paragraph.id} paragraph={paragraph} />
        ) : null
      })}
    </div>
  )
}
