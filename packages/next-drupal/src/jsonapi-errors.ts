import { JsonApiError } from "./types"

export class JsonApiErrors extends Error {
  errors: JsonApiError[]
  statusCode: number

  constructor(errors: JsonApiError[], statusCode: number) {
    super()

    this.errors = errors
    this.statusCode = statusCode
    this.message = JsonApiErrors.formatMessage(errors)
  }

  private static formatMessage(errors) {
    const [error] = errors

    let message = `${error.status} ${error.title}`

    if (error.detail) {
      message += `\n${error.detail}`
    }

    return message
  }
}
