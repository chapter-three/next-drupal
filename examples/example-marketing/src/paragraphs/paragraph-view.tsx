import { ViewPropertiesListing } from "@/views/view-properties-listing"

export default function ParagraphView({ paragraph, ...props }) {
  if (paragraph.field_view.name === "properties--listing") {
    return <ViewPropertiesListing view={paragraph.field_view} {...props} />
  }

  return null
}
