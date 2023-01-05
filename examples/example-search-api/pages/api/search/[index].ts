import { NextApiRequest, NextApiResponse } from "next"
import { DrupalNode, getSearchIndex } from "next-drupal"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const body = JSON.parse(request.body)

    const { index } = request.query

    const results = await getSearchIndex<DrupalNode>(index as string, body)

    console.log({ results })

    response.json(results)
  } catch (error) {
    return response.status(400).json(error.message)
  }
}
