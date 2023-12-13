import type { NextApiRequest, NextApiResponse } from "next"

export default async function exit(
  _: NextApiRequest,
  response: NextApiResponse
) {
  response.clearPreviewData()
  response.writeHead(307, { Location: "/" })
  response.end()
}
