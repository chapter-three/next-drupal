import { Jsona } from "jsona"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals"
import { NextDrupal, NextDrupalBase } from "../../src"
import { BASE_URL } from "../utils"
import type { JsonDeserializer, NextDrupalOptions } from "../../src"

jest.mock("jsona", () => {
  // Re-use the same method mock for each Jsona mock object.
  const deserialize = jest.fn()
  function JsonaMock() {
    return {
      deserialize,
    }
  }

  return {
    __esModule: true,
    Jsona: jest.fn(JsonaMock),
  }
})

beforeEach(() => {
  // @ts-expect-error
  Jsona.mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe("baseUrl parameter", () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  test("turns throwJsonApiErrors off in production", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "production",
    }

    const drupal = new NextDrupal(BASE_URL)
    expect(drupal.throwJsonApiErrors).toBe(false)
  })

  test("returns a NextDrupal", () => {
    expect(new NextDrupal(BASE_URL)).toBeInstanceOf(NextDrupal)
    expect(new NextDrupal(BASE_URL)).toBeInstanceOf(NextDrupalBase)
  })
})

describe("options parameter", () => {
  describe("apiPrefix", () => {
    test('defaults to "/jsonapi"', () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.apiPrefix).toBe("/jsonapi")
    })

    test("sets the apiPrefix", () => {
      const customEndPoint = "/customapi"
      const drupal = new NextDrupal(BASE_URL, {
        apiPrefix: customEndPoint,
      })
      expect(drupal.apiPrefix).toBe(customEndPoint)
    })
  })

  describe("cache", () => {
    test("defaults to `null`", () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.cache).toBe(null)
    })

    test("sets the cache storage", () => {
      const customCache: NextDrupal["cache"] = {
        async get(key) {
          //
        },
        async set(key, value, ttl?: number) {
          //
        },
      }
      const drupal = new NextDrupal(BASE_URL, {
        cache: customCache,
      })
      expect(drupal.cache).toBe(customCache)
    })
  })

  describe("deserializer", () => {
    test("defaults to `Jsona.deserialize`", () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.deserializer.name).toBe("jsonaDeserialize")
      expect(drupal.deserializer.length).toBe(2)
      expect(Jsona).toBeCalledTimes(1)

      const deserializeMock = new Jsona().deserialize
      // @ts-expect-error
      deserializeMock.mockClear()
      const args: Parameters<JsonDeserializer> = [{}, { options: true }]
      drupal.deserialize(...args)
      expect(deserializeMock).toBeCalledTimes(1)
      expect(deserializeMock).toHaveBeenLastCalledWith(...args)
    })

    test("sets up a custom deserializer", () => {
      const customDeserializer: NextDrupalOptions["deserializer"] =
        function deserialize(
          body: Record<string, unknown>,
          options?: Record<string, unknown>
        ): unknown {
          return {
            deserialized: true,
          }
        }

      const drupal = new NextDrupal(BASE_URL, {
        deserializer: customDeserializer,
      })
      expect(drupal.deserializer).toBe(customDeserializer)
    })
  })

  describe("frontPage", () => {
    test('defaults to "/home"', () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.frontPage).toBe("/home")
    })

    test("sets up a custom frontPage", () => {
      const customFrontPage = "/front"

      const drupal = new NextDrupal(BASE_URL, {
        frontPage: customFrontPage,
      })
      expect(drupal.frontPage).toBe(customFrontPage)
    })
  })

  describe("headers", () => {
    test("defaults to `Content-Type`/`Accept`", () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(Object.fromEntries(drupal.headers.entries())).toMatchObject({
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
      })
    })

    test("sets custom headers", () => {
      const customHeaders = {
        CustomContentType: "application/json",
        CustomAccept: "application/json",
      }
      const expectedHeaders = {}
      Object.keys(customHeaders).forEach((header) => {
        expectedHeaders[header.toLowerCase()] = customHeaders[header]
      })

      const drupal = new NextDrupal(BASE_URL, {
        headers: customHeaders,
      })

      expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
        expectedHeaders
      )
    })
  })

  describe("throwJsonApiErrors", () => {
    test("defaults to `true`", () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.throwJsonApiErrors).toBe(true)
    })

    test("can be set to `false`", () => {
      const drupal = new NextDrupal(BASE_URL, {
        throwJsonApiErrors: false,
      })
      expect(drupal.throwJsonApiErrors).toBe(false)
    })
  })

  describe("useDefaultEndpoints", () => {
    test("defaults to `true`", () => {
      const drupal = new NextDrupal(BASE_URL)
      expect(drupal.useDefaultEndpoints).toBe(true)
    })

    test("can be set to `false`", () => {
      const drupal = new NextDrupal(BASE_URL, {
        useDefaultEndpoints: false,
      })
      expect(drupal.useDefaultEndpoints).toBe(false)
    })
  })
})
