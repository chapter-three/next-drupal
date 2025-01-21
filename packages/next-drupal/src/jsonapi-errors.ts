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

/** @hidden */
export class JsonApiErrors extends Error {
  errors: JsonApiError[] | string
  statusCode: number

  constructor(
    errors: JsonApiError[] | string,
    statusCode: number,
    messagePrefix: string = ""
  ) {
    super()

    this.errors = errors
    this.statusCode = statusCode
    this.message =
      (messagePrefix ? `${messagePrefix} ` : "") +
      JsonApiErrors.formatMessage(errors)
  }

  static formatMessage(errors: JsonApiError[] | string) {
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
