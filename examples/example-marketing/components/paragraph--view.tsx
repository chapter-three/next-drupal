import { ViewPropertiesListing } from "components/view--properties_listing"

export function ParagraphView({ paragraph, ...props }) {
  if (paragraph.field_view.name === "properties--listing") {
    return <ViewPropertiesListing view={paragraph.field_view} {...props} />
  }

  return null
}
