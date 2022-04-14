import { DrupalNode } from "next-drupal"

import { Post } from "types"
import { formatAuthor } from "formatters/author"
import { formatImage } from "formatters/image"

// This is a custom data formatter for converting a node-article to a post.
export function formatPost(node: DrupalNode): Post {
  return {
    id: node.id,
    title: node.title,
    date: node.created,
    url: node.path.alias,
    body: node.body?.processed,
    image: node.field_image && formatImage(node.field_image),
    author: formatAuthor(node.uid),
  }
}
