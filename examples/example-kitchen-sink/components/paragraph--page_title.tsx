import { ParagraphProps } from "components/paragraph"
import { FormattedText } from "components/formatted-text"

export function ParagraphPageTitle({ paragraph, ...props }: ParagraphProps) {
  return (
    <div className="pt-12 space-y-8 text-center" {...props}>
      <h1 className="text-6xl font-semibold tracking-tight text-center">
        {paragraph.field_heading}
      </h1>
      <div className="max-w-2xl mx-auto text-lg text-gray-500">
        <FormattedText text={paragraph.field_text.processed} />
      </div>
    </div>
  )
}
