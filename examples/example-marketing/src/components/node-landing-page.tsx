import dynamic from "next/dynamic"

export function NodeLandingPage({ node, ...props }) {
  if (!node.field_sections?.length) return null

  return (
    <div {...props}>
      {node.field_sections.map((section) => {
        if (section.type === "paragraph--from_library") {
          section = section.field_reusable_paragraph.paragraphs
        }

        const section_type = section.type.replace("paragraph--", "")
        // TODO: Replace with static import.
        const Section = dynamic<{ section: unknown }>(
          () => import(`../sections/${section_type}.tsx`)
        )

        return Section ? <Section key={section.id} section={section} /> : null
      })}
    </div>
  )
}
