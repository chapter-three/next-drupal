import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { DrupalClient, JsonApiErrors } from "../../src"
import { BASE_URL, mockLogger, spyOnFetch, spyOnFetchOnce } from "../utils"
import type { DrupalNode, JsonApiError, Serializer } from "../../src"

jest.setTimeout(10000)

afterEach(() => {
  jest.restoreAllMocks()
})

describe("buildUrl()", () => {
  const client = new DrupalClient(BASE_URL)

  test("builds a url", () => {
    expect(client.buildUrl("http://example.com").toString()).toEqual(
      "http://example.com/"
    )
  })

  test("builds a relative url", () => {
    expect(client.buildUrl("/foo").toString()).toEqual(`${BASE_URL}/foo`)
  })

  test("builds a url with params", () => {
    expect(client.buildUrl("/foo", { bar: "baz" }).toString()).toEqual(
      `${BASE_URL}/foo?bar=baz`
    )

    expect(
      client
        .buildUrl("/jsonapi/node/article", {
          sort: "-created",
          "fields[node--article]": "title,path",
        })
        .toString()
    ).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })

  test("builds a url from object (DrupalJsonApiParams)", () => {
    const params = {
      getQueryObject: () => ({
        sort: "-created",
        "fields[node--article]": "title,path",
      }),
    }

    expect(client.buildUrl("/jsonapi/node/article", params).toString()).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })
})

describe("debug()", () => {
  test("does not print messages by default", () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, { logger })
    const message = "Example message"
    client.debug(message)
    expect(logger.debug).not.toHaveBeenCalled()
  })

  test("prints messages when debugging on", () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, { logger, debug: true })
    const message = "Example message"
    client.debug(message)
    expect(logger.debug).toHaveBeenCalledWith("Debug mode is on.")
    expect(logger.debug).toHaveBeenCalledWith(message)
  })
})

describe("deserialize()", () => {
  test("deserializes JSON:API resource", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053",
      {
        include: "field_tags",
      }
    )

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const article = client.deserialize(json) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.field_tags).toHaveLength(3)
  })

  test("deserializes JSON:API collection", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client.buildUrl("/jsonapi/node/article", {
      getQueryObject: () => ({
        "fields[node--article]": "title",
      }),
    })

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const articles = client.deserialize(json) as DrupalNode[]

    expect(articles).toMatchSnapshot()
  })

  test("allows for custom data serializer", async () => {
    const serializer: Serializer = {
      deserialize: (
        body: { data: { id: string; attributes: { title: string } } },
        options: { pathPrefix: string }
      ) => {
        return {
          id: body.data.id,
          title: `${options.pathPrefix}: ${body.data.attributes.title}`,
        }
      },
    }
    const client = new DrupalClient(BASE_URL, {
      serializer,
    })
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053"
    )

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const article = client.deserialize(json, {
      pathPrefix: "TITLE",
    }) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.title).toEqual(`TITLE: ${json.data.attributes.title}`)
  })

  test("returns null if no body", () => {
    const client = new DrupalClient(BASE_URL)
    expect(client.deserialize("")).toBe(null)
  })
})

describe("formatJsonApiErrors()", () => {
  const errors: JsonApiError[] = [
    {
      status: "404",
      title: "First error",
    },
    {
      status: "500",
      title: "Second error",
      detail: "is ignored",
    },
  ]
  const client = new DrupalClient(BASE_URL)

  test("formats the first error in the array", () => {
    expect(client.formatJsonApiErrors(errors)).toBe("404 First error")
  })

  test("includes the optional error detail", () => {
    expect(
      client.formatJsonApiErrors([
        {
          ...errors[0],
          detail: "Detail is included.",
        },
        errors[1],
      ])
    ).toBe("404 First error\nDetail is included.")
  })
})

describe("getErrorsFromResponse()", () => {
  const client = new DrupalClient(BASE_URL)

  test("returns application/json error message", async () => {
    const message = "An error occurred."
    const response = new Response(JSON.stringify({ message }), {
      status: 403,
      headers: {
        "content-type": "application/json",
      },
    })

    expect(await client.getErrorsFromResponse(response)).toBe(message)
  })

  test("returns application/vnd.api+json errors", async () => {
    const payload = {
      errors: [
        {
          status: "404",
          title: "Not found",
          detail: "Oops.",
        },
        {
          status: "418",
          title: "I am a teapot",
          detail: "Even RFCs have easter eggs.",
        },
      ] as JsonApiError[],
    }
    const response = new Response(JSON.stringify(payload), {
      status: 403,
      headers: {
        "content-type": "application/vnd.api+json",
      },
    })

    expect(await client.getErrorsFromResponse(response)).toMatchObject(
      payload.errors
    )
  })

  test("returns the response status text if the application/vnd.api+json errors cannot be found", async () => {
    const payload = {
      contains: 'no "errors" entry',
    }
    const response = new Response(JSON.stringify(payload), {
      status: 418,
      statusText: "I'm a Teapot",
      headers: {
        "content-type": "application/vnd.api+json",
      },
    })

    expect(await client.getErrorsFromResponse(response)).toBe("I'm a Teapot")
  })

  test("returns the response status text if no errors can be found", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 403,
      statusText: "Forbidden",
    })

    expect(await client.getErrorsFromResponse(response)).toBe("Forbidden")
  })
})

describe("throwError()", () => {
  test("throws the error", () => {
    const client = new DrupalClient(BASE_URL)
    expect(() => {
      client.throwError(new Error("Example error"))
    }).toThrow("Example error")
  })

  test("logs the error when throwJsonApiErrors is false", () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      throwJsonApiErrors: false,
      logger,
    })
    expect(() => {
      client.throwError(new Error("Example error"))
    }).not.toThrow()
    expect(logger.error).toHaveBeenCalledWith(new Error("Example error"))
  })
})

describe("throwIfJsonApiErrors()", () => {
  const client = new DrupalClient(BASE_URL)

  test("does not throw if response is ok", async () => {
    expect.assertions(1)

    const response = new Response(JSON.stringify({}))

    await expect(client.throwIfJsonApiErrors(response)).resolves.toBe(undefined)
  })

  test("throws a JsonApiErrors object", async () => {
    expect.assertions(1)

    const payload = {
      errors: [
        {
          status: "404",
          title: "Not found",
          detail: "Oops.",
        },
        {
          status: "418",
          title: "I am a teapot",
          detail: "Even RFCs have easter eggs.",
        },
      ] as JsonApiError[],
    }
    const status = 403
    const response = new Response(JSON.stringify(payload), {
      status,
      headers: {
        "content-type": "application/vnd.api+json",
      },
    })

    const expectedError = new JsonApiErrors(payload.errors, status)
    await expect(client.throwIfJsonApiErrors(response)).rejects.toEqual(
      expectedError
    )
  })
})

describe("validateDraftUrl()", () => {
  test("outputs debug messages", async () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      debug: true,
      logger,
    })
    const path = "/example"
    const searchParams = new URLSearchParams({
      path,
    })

    const testPayload = { test: "resolved" }
    spyOnFetchOnce({
      responseBody: testPayload,
    })
    spyOnFetchOnce({
      responseBody: {
        message: "fail",
      },
      status: 404,
    })

    let response = await client.validateDraftUrl(searchParams)
    expect(response.status).toBe(200)
    expect(logger.debug).toHaveBeenCalledWith("Debug mode is on.")
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching draft url validation for ${path}.`
    )
    expect(logger.debug).toHaveBeenCalledWith(`Validated path, ${path}`)

    response = await client.validateDraftUrl(searchParams)
    expect(response.status).toBe(404)
    expect(logger.debug).toHaveBeenCalledWith(
      `Could not validate path, ${path}`
    )
  })

  test("calls draft-url endpoint", async () => {
    const client = new DrupalClient(BASE_URL)
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const testPayload = { test: "resolved" }
    const fetchSpy = spyOnFetch({ responseBody: testPayload })

    await client.validateDraftUrl(searchParams)

    expect(fetchSpy).toHaveBeenNthCalledWith(
      1,
      `${BASE_URL}/next/draft-url`,
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(searchParams.entries())),
      })
    )
  })

  test("returns a response object on success", async () => {
    const client = new DrupalClient(BASE_URL)
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const testPayload = { test: "resolved" }
    spyOnFetch({ responseBody: testPayload })

    const response = await client.validateDraftUrl(searchParams)

    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject(testPayload)
  })

  test("returns a response if fetch throws", async () => {
    const client = new DrupalClient(BASE_URL)
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const message = "random fetch error"
    spyOnFetch({ throwErrorMessage: message })

    const response = await client.validateDraftUrl(searchParams)

    expect(response.ok).toBe(false)
    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({ message })
  })
})
