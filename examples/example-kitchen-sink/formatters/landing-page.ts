import { absoluteURL } from "lib/utils"
import { DrupalNode } from "next-drupal"

import { LandingPage, PageFeature, PageHeader, PageView } from "types"
import { formatImage } from "./image"

export function formatLandingPage(node: DrupalNode): LandingPage {
  return {
    sections: node.field_sections.map((section) => {
      if (section.type === "paragraph--page_header") {
        return {
          id: section.id,
          type: "page_header",
          heading: section.field_heading,
          text: section.field_text?.processed,
        } as PageHeader
      }

      if (section.type === "paragraph--view") {
        return {
          id: section.id,
          type: "view",
          view: section.field_view,
        } as PageView
      }

      if (section.type === "paragraph--feature") {
        return {
          id: section.id,
          type: "feature",
          heading: section.field_heading,
          text: section.field_text.processed,
          image: formatImage(section.field_media.field_media_image),
          link: {
            title: section.field_link.title,
            href: section.field_link.url,
          },
        } as PageFeature
      }

      if (section.type === "paragraph--video") {
        return {
          id: section.id,
          type: "video",
          video: absoluteURL(
            section.field_media.field_media_video_file.uri.url
          ),
        }
      }

      return null
    }),
  }
}
