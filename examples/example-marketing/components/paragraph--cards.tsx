import { ParagraphProps } from "components/paragraph"
import { SectionHeader } from "components/section-header"
import { FormattedText } from "components/formatted-text"
import { Section } from "components/section"

export function ParagraphCards({ paragraph, ...props }: ParagraphProps) {
  return (
    <Section
      backgroundColor={
        paragraph.field_background_color === "muted" && "bg-gray-50"
      }
      {...props}
    >
      <SectionHeader
        heading={paragraph.field_heading}
        text={paragraph.field_text?.processed}
        links={paragraph.field_links}
      />
      <div className="container px-6 mx-auto">
        {paragraph.field_items?.length && (
          <div className="grid justify-center gap-20 pt-20 lg:grid-cols-3">
            {paragraph.field_items.map((card) => (
              <div key={card.id} className="max-w-sm text-center lg:max-w-none">
                <h3 className="text-2xl font-bold">{card.field_heading}</h3>
                {card.field_text?.processed && (
                  <FormattedText
                    processed={card.field_text?.processed}
                    className="pt-2 text-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
