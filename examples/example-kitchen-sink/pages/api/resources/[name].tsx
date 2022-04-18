import { drupal } from "lib/drupal"
import { NextApiRequest, NextApiResponse } from "next"
import { parse } from "qs"

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "GET") {
    return response.status(405).end()
  }

  try {
    const { name, ...options } = request.query

    // Make a request to Drupal to get resources.
    // This is run on the server.
    // It is safe to use keys and make authenticated requests.
    const result = await drupal.getResourceCollection(
      name as string,
      parse(options)
    )

    return response.json(result)
  } catch (error) {
    return response.status(422).end(error.message)
  }
}
