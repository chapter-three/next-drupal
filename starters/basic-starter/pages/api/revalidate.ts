import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let path = request.query.path as string
  const secret = request.query.secret as string

  // Validate secret.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return response.status(401).json({ message: "Invalid secret." })
  }

  // Validate path.
  if (!path) {
    return response.status(400).json({ message: "Invalid path." })
  }

  try {
    await response.revalidate(path)

    return response.json({})
  } catch (error) {
    return response.status(404).json({
      message: (error as Error).message,
    })
  }
}
