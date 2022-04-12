import { ParagraphProps } from "./paragraph"
import { View } from "./view"

export function ParagraphView({ paragraph, ...props }: ParagraphProps) {
  return <View view={paragraph.view} {...props} />
}
