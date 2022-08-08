import { SectionText } from "types"

interface SectionTextProps {
  section: SectionText
}

export function SectionText({ section }: SectionTextProps) {
  if (!section.text) {
    return null
  }

  return <div dangerouslySetInnerHTML={{ __html: section.text }} />
}
