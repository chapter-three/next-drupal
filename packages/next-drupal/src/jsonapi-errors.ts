// https://jsonapi.org/format/#error-objects
export interface JsonApiError {
  id?: string
  status?: string
  code?: string
  title?: string
  detail?: string
  links?: JsonApiLinks
}

// https://jsonapi.org/format/#document-links
export interface JsonApiLinks {
  [key: string]: string | Record<string, string>
}

export class JsonApiErrors extends Error {
  errors: JsonApiError[] | string
  statusCode: number

  constructor(errors: JsonApiError[], statusCode: number) {
    super()

    this.errors = errors
    this.statusCode = statusCode
    this.message = JsonApiErrors.formatMessage(errors)
  }

  private static formatMessage(errors) {
    if (typeof errors === "string") {
      return errors
    }

    const [error] = errors

    let message = `${error.status} ${error.title}`

    if (error.detail) {
      message += `\n${error.detail}`
    }

    return message
  }
}
