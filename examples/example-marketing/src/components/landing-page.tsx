import dynamic from "next/dynamic"

interface LandingPageProps {
  page: Record<string, any>
}

export function LandingPage({ page }: LandingPageProps) {
  return page.field_sections?.length ? (
    <>
      {page.field_sections.map((section) => {
        if (section.type === "paragraph--from_library") {
          section = section.field_reusable_paragraph.paragraphs
        }

        const section_type = section.type.replace("paragraph--", "")
        const Section = dynamic<{ section: unknown }>(
          () => import(`../sections/${section_type}.tsx`)
        )

        return Section ? <Section key={section.id} section={section} /> : null
      })}
    </>
  ) : null
}
