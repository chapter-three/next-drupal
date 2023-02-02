import { NextApiResponse } from "next"

export default async function exit(_, response: NextApiResponse) {
  response.clearPreviewData()
  response.writeHead(307, { Location: "/" })
  response.end()
}
