import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { JsonApiErrors, NextDrupalBase } from "../../src"
import { BASE_URL, mockLogger, spyOnFetch, spyOnFetchOnce } from "../utils"
import type { JsonApiError } from "../../src"

jest.setTimeout(10000)

afterEach(() => {
  jest.restoreAllMocks()
})

describe("addLocalePrefix()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test('returns path with leading "/"', () => {
    expect(drupal.addLocalePrefix("foo")).toBe("/foo")
  })

  test("returns path when using default locale", () => {
    expect(
      drupal.addLocalePrefix("/foo", {
        locale: "es",
        defaultLocale: "es",
      })
    ).toBe("/foo")
  })

  test("returns path when using non-default locale", () => {
    expect(
      drupal.addLocalePrefix("/foo", {
        locale: "es",
        defaultLocale: "en",
      })
    ).toBe("/es/foo")
  })
})

describe("buildUrl()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test("returns a URL object", () => {
    const url = drupal.buildUrl("")
    expect(url).toBeInstanceOf(URL)
    expect(url.toString()).toEqual(`${BASE_URL}/`)
  })

  test("adds baseURL if given a relative path", () => {
    expect(drupal.buildUrl("/foo").toString()).toEqual(`${BASE_URL}/foo`)
  })

  test("does not add baseURL if path includes hostname", () => {
    const path = "https://example.com/foo"
    expect(drupal.buildUrl(path).toString()).toEqual(path)
  })

  test("adds the searchParams", () => {
    expect(drupal.buildUrl("/foo", { bar: "baz" }).toString()).toEqual(
      `${BASE_URL}/foo?bar=baz`
    )

    expect(
      drupal
        .buildUrl("/jsonapi/node/article", {
          sort: "-created",
          "fields[node--article]": "title,path",
        })
        .toString()
    ).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })

  test("adds the searchParams from a DrupalJsonApiParams", () => {
    const searchParams = {
      getQueryObject: () => ({
        sort: "-created",
        "fields[node--article]": "title,path",
      }),
    }

    expect(
      drupal.buildUrl("/jsonapi/node/article", searchParams).toString()
    ).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })

  test("does not throw an error when searchParams is null", () => {
    expect(() =>
      drupal.buildUrl("/some-path", null).toString()
    ).not.toThrowError(
      "Cannot use 'in' operator to search for 'getQueryObject' in null"
    )
  })
})

describe("buildEndpoint()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test("returns a URL string", async () => {
    const endpoint = await drupal.buildEndpoint()

    expect(typeof endpoint).toBe("string")
  })

  test("adds the apiPrefix", async () => {
    const drupal = new NextDrupalBase(BASE_URL, { apiPrefix: "/someapi" })

    const endpoint = await drupal.buildEndpoint()

    expect(endpoint).toBe(`${BASE_URL}/someapi`)
  })

  test("adds the path", async () => {
    const endpoint = await drupal.buildEndpoint({ path: "/some-path" })

    expect(endpoint).toBe(`${BASE_URL}/some-path`)
  })

  test('ensures the path starts with "/"', async () => {
    const endpoint = await drupal.buildEndpoint({
      path: "some-path",
    })

    expect(endpoint).toBe(`${BASE_URL}/some-path`)
  })

  test("adds the search params", async () => {
    const endpoint = await drupal.buildEndpoint({
      path: "/zoo",
      searchParams: { animal: "unicorn" },
    })

    expect(endpoint).toBe(`${BASE_URL}/zoo?animal=unicorn`)
  })

  test("adds locale then apiPrefix then path", async () => {
    const drupal = new NextDrupalBase(BASE_URL, { apiPrefix: "/someapi" })
    const endpoint = await drupal.buildEndpoint({
      locale: "en",
      path: "/zoo",
      searchParams: { animal: "unicorn" },
    })

    expect(endpoint).toBe(`${BASE_URL}/en/someapi/zoo?animal=unicorn`)
  })
})

describe("constructPathFromSegment()", () => {
  const frontPage = "/home"
  const drupal = new NextDrupalBase(BASE_URL, { frontPage })

  describe("with no options", () => {
    test("returns homepage given no segments", () => {
      expect(drupal.constructPathFromSegment(undefined)).toBe(frontPage)
      expect(drupal.constructPathFromSegment("")).toBe(frontPage)
      expect(drupal.constructPathFromSegment([])).toBe(frontPage)
      expect(drupal.constructPathFromSegment([""])).toBe(frontPage)
    })

    test("returns path given string", () => {
      expect(drupal.constructPathFromSegment("foo")).toBe("/foo")
    })

    test("returns path given array", () => {
      expect(drupal.constructPathFromSegment(["foo"])).toBe("/foo")

      expect(drupal.constructPathFromSegment(["foo", "bar"])).toBe("/foo/bar")
    })

    test("encodes path with punctuation", async () => {
      expect(
        drupal.constructPathFromSegment(["path&with", "^punc&", "in$path"])
      ).toEqual("/path%26with/%5Epunc%26/in%24path")
    })

    test("prevents path from ending in slash", () => {
      expect(drupal.constructPathFromSegment(["foo", ""])).toBe("/foo")
    })
  })

  describe("with locale options", () => {
    test("returns path when using default locale", () => {
      expect(
        drupal.constructPathFromSegment(["foo"], {
          locale: "es",
          defaultLocale: "es",
        })
      ).toBe("/foo")
    })

    test("returns path when using non-default locale", () => {
      expect(
        drupal.constructPathFromSegment(["foo"], {
          locale: "es",
          defaultLocale: "en",
        })
      ).toBe("/es/foo")
    })
  })

  describe("with pathPrefix option", () => {
    const pathPrefix = "/prefix"
    const options = {
      pathPrefix,
    }

    test("returns path with prefix", () => {
      expect(drupal.constructPathFromSegment(["foo"], options)).toBe(
        `${pathPrefix}/foo`
      )
    })

    test('returns correct path given "/" prefix', () => {
      expect(
        drupal.constructPathFromSegment(["foo"], { pathPrefix: "/" })
      ).toBe("/foo")
    })

    test('returns correct path given prefix not starting in "/"', () => {
      expect(
        drupal.constructPathFromSegment(["foo"], { pathPrefix: "prefix" })
      ).toBe("/prefix/foo")
    })

    test('returns correct path given prefix ending in "/"', () => {
      expect(
        drupal.constructPathFromSegment(["foo"], { pathPrefix: "/prefix/" })
      ).toBe("/prefix/foo")
    })

    test("returns pathPrefix given no segments", () => {
      expect(drupal.constructPathFromSegment(undefined, options)).toBe(
        pathPrefix
      )
      expect(drupal.constructPathFromSegment("", options)).toBe(pathPrefix)
      expect(drupal.constructPathFromSegment([], options)).toBe(pathPrefix)
      expect(drupal.constructPathFromSegment([""], options)).toBe(pathPrefix)
    })
  })
})

describe("debug()", () => {
  test("does not print messages by default", () => {
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, { logger })
    const message = "Example message"
    drupal.debug(message)
    expect(logger.debug).not.toHaveBeenCalled()
  })

  test("prints messages when debugging on", () => {
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, { logger, debug: true })
    const message = "Example message"
    drupal.debug(message)
    expect(logger.debug).toHaveBeenCalledWith("Debug mode is on.")
    expect(logger.debug).toHaveBeenCalledWith(message)
  })
})

describe("getErrorsFromResponse()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test("returns application/json error message", async () => {
    const message = "An error occurred."
    const response = new Response(JSON.stringify({ message }), {
      status: 403,
      headers: {
        "content-type": "application/json",
      },
    })

    expect(await drupal.getErrorsFromResponse(response)).toBe(message)
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
      ],
    }
    const response = new Response(JSON.stringify(payload), {
      status: 403,
      headers: {
        "content-type": "application/vnd.api+json",
      },
    })

    expect(await drupal.getErrorsFromResponse(response)).toMatchObject(
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

    expect(await drupal.getErrorsFromResponse(response)).toBe("I'm a Teapot")
  })

  test("returns the response status text if no errors can be found", async () => {
    const response = new Response(JSON.stringify({}), {
      status: 403,
      statusText: "Forbidden",
    })

    expect(await drupal.getErrorsFromResponse(response)).toBe("Forbidden")
  })
})

describe("throwIfJsonErrors()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test("does not throw if response is ok", async () => {
    expect.assertions(1)

    const response = new Response(JSON.stringify({}))

    await expect(drupal.throwIfJsonErrors(response)).resolves.toBe(undefined)
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
    await expect(drupal.throwIfJsonErrors(response)).rejects.toEqual(
      expectedError
    )
  })

  test("adds an error prefix", async () => {
    expect.assertions(1)

    const payload = {
      errors: [
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

    const messagePrefix = "Optional error message prefix:"
    const expectedError = new JsonApiErrors(payload.errors, status)
    expectedError.message = `${messagePrefix} ${expectedError.message}`

    await expect(
      drupal.throwIfJsonErrors(response, messagePrefix)
    ).rejects.toEqual(expectedError)
  })

  test("throws if optionalCondition is true", async () => {
    expect.assertions(1)

    const payload = {
      errors: [
        {
          status: "418",
          title: "I am a teapot",
          detail: "Even RFCs have easter eggs.",
        },
      ] as JsonApiError[],
    }
    const status = 200
    const response = new Response(JSON.stringify(payload), {
      status,
      headers: {
        "content-type": "application/vnd.api+json",
      },
    })

    const expectedError = new JsonApiErrors(payload.errors, status)

    await expect(
      drupal.throwIfJsonErrors(response, "", response.status !== 207)
    ).rejects.toEqual(expectedError)
  })
})

describe("validateDraftUrl()", () => {
  const drupal = new NextDrupalBase(BASE_URL)

  test("outputs debug messages", async () => {
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
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

    let response = await drupal.validateDraftUrl(searchParams)

    expect(response.status).toBe(200)
    expect(logger.debug).toHaveBeenCalledWith("Debug mode is on.")
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching draft url validation for ${path}.`
    )
    expect(logger.debug).toHaveBeenCalledWith(`Validated path, ${path}`)

    response = await drupal.validateDraftUrl(searchParams)

    expect(response.status).toBe(404)
    expect(logger.debug).toHaveBeenCalledWith(
      `Could not validate path, ${path}`
    )
  })

  test("calls draft-url endpoint", async () => {
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const testPayload = { test: "resolved" }
    const fetchSpy = spyOnFetch({ responseBody: testPayload })

    await drupal.validateDraftUrl(searchParams)

    expect(fetchSpy.mock.calls[0][0]).toBe(`${BASE_URL}/next/draft-url`)
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({
      method: "POST",
      body: JSON.stringify(Object.fromEntries(searchParams.entries())),
    })
    expect(
      Object.fromEntries(
        (fetchSpy.mock.calls[0][1].headers as Headers).entries()
      )
    ).toMatchObject({
      accept: "application/vnd.api+json",
      "content-type": "application/json",
    })
  })

  test("returns a response object on success", async () => {
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const testPayload = { test: "resolved" }
    spyOnFetch({ responseBody: testPayload })

    const response = await drupal.validateDraftUrl(searchParams)

    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject(testPayload)
  })

  test("returns a response if fetch throws", async () => {
    const searchParams = new URLSearchParams({
      path: "/example",
    })

    const message = "random fetch error"
    spyOnFetch({ throwErrorMessage: message })

    const response = await drupal.validateDraftUrl(searchParams)

    expect(response.ok).toBe(false)
    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({ message })
  })
})
