import { Section, SectionType } from "types"
import { SectionColumns } from "components/section--columns"
import { SectionImage } from "components/section--image"
import { SectionText } from "components/section--text"
import { SectionCard } from "components/section--card"

type SectionTypes = {
  [key in SectionType]: ({ section }) => JSX.Element
}

const sectionTypes: SectionTypes = {
  "section--columns": SectionColumns,
  "section--image": SectionImage,
  "section--text": SectionText,
  "section--card": SectionCard,
}

interface SectionsProps {
  sections: Section[]
}

export function Sections({ sections }: SectionsProps) {
  if (!sections?.length) {
    return null
  }

  return (
    <>
      {sections?.map((section) => {
        const SectionComponent = sectionTypes[section?.type]

        if (!SectionComponent) {
          return null
        }

        return <SectionComponent key={section.id} section={section} />
      })}
    </>
  )
}
