import { clsx } from "clsx"
import { SectionColumns } from "types"
import { Sections } from "components/sections"

interface SectionColumnsProps {
  section: SectionColumns
}

export function SectionColumns({ section }: SectionColumnsProps) {
  return (
    <section>
      {section.heading && <h2>{section.heading}</h2>}
      <div
        className={clsx("grid items-start gap-10", {
          "grid-cols-2": section.columns === "50-50",
          "grid-cols-[1f_2fr]": section.columns === "25-75",
          "grid-cols-[2fr_1fr]": section.columns === "75-25",
          "grid-cols-[1fr_1fr_1fr]": section.columns === "33-33-33",
        })}
      >
        {section.sections?.length ? (
          <Sections sections={section.sections} />
        ) : null}
      </div>
    </section>
  )
}
