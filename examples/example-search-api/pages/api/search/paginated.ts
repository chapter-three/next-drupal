import { NextApiRequest, NextApiResponse } from "next"
import { deserialize, DrupalNode, getSearchIndex } from "next-drupal"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const results = await getSearchIndex<DrupalNode>("article", {
      params: request.body.params,
      // We are using deserialize: false here because we need the links for pagination.
      deserialize: false,
    })

    response.json({
      total: results.meta.count,
      items: deserialize(results),
      nextPage: results.links?.next ? parseInt(request.body.page) + 1 : null,
    })
  } catch (error) {
    return response.status(400).json(error.message)
  }
}
