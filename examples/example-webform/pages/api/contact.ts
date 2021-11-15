import { NextApiRequest, NextApiResponse } from "next"
import * as yup from "yup"
import { contactFormSchema } from "../../validations/contact"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method === "POST") {
      // Validate form submission.
      const body = await contactFormSchema.validate(request.body)

      // Submit to Drupal.
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/webform_rest/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            webform_id: "contact",
            ...body,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!result.ok) {
        throw new Error()
      }

      response.status(200).end()
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return response.status(422).json(error.message)
    }

    return response.status(400).json(error.message)
  }
}
