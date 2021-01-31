import { NextApiRequest, NextApiResponse } from "next"

export default function (request: NextApiRequest, response: NextApiResponse) {
  const { slug, resourceVersion, secret } = request.query

  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({ message: "Invalid preview secret." })
  }

  if (!slug) {
    return response.status(401).json({ message: "Invalid slug." })
  }

  response.setPreviewData({
    resourceVersion,
  })

  response.redirect(slug as string)
}
