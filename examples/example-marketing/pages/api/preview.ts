import { NextApiRequest, NextApiResponse } from "next"
import { getEntityByPath } from "next-drupal"

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { slug, resourceVersion, secret } = request.query

  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({ message: "Invalid preview secret." })
  }

  if (!slug) {
    return response.status(401).json({ message: "Invalid slug." })
  }

  const node = await getEntityByPath(slug as string)

  if (!node) {
    return response.status(404).json({ message: "Invalid slug" })
  }

  response.setPreviewData({
    resourceVersion,
  })

  response.writeHead(307, { Location: node.path.alias })
  response.end()
}
