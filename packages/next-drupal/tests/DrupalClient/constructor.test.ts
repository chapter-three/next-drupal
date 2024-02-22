import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { Jsona } from "jsona"
import { DrupalClient } from "../../src"
import { DEBUG_MESSAGE_PREFIX, logger as defaultLogger } from "../../src/logger"
import { BASE_URL } from "../utils"
import type { Logger } from "../../src"

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

  test("throws error given an invalid baseUrl", () => {
    // @ts-ignore
    expect(() => new DrupalClient()).toThrow("The 'baseUrl' param is required.")

    // @ts-ignore
    expect(() => new DrupalClient({})).toThrow(
      "The 'baseUrl' param is required."
    )
  })

  test("turns throwJsonApiErrors off in production", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "production",
    }

    const client = new DrupalClient(BASE_URL)
    expect(client.throwJsonApiErrors).toBe(false)
  })

  test("announces debug mode when turned on", () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
      //
    })

    new DrupalClient(BASE_URL, {
      debug: true,
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      DEBUG_MESSAGE_PREFIX,
      "Debug mode is on."
    )
  })

  test("returns a DrupalClient", () => {
    expect(new DrupalClient(BASE_URL)).toBeInstanceOf(DrupalClient)
  })
})

describe("options parameter", () => {
  describe("accessToken", () => {
    test("defaults to `undefined`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.accessToken).toBe(undefined)
    })

    test("sets the accessToken", async () => {
      const accessToken = {
        token_type: "Bearer",
        expires_in: 300,
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVlNDkyOTI4ZTZjNj",
      }

      const client = new DrupalClient(BASE_URL, {
        accessToken,
      })

      expect(client.accessToken).toEqual(accessToken)
    })
  })

  describe("apiPrefix", () => {
    test('defaults to "/jsonapi"', () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.apiPrefix).toBe("/jsonapi")
    })

    test("sets the apiPrefix", () => {
      const customEndPoint = "/customapi"
      const client = new DrupalClient(BASE_URL, {
        apiPrefix: customEndPoint,
      })
      expect(client.apiPrefix).toBe(customEndPoint)
    })
  })

  describe("auth", () => {
    test("defaults to `undefined`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.auth).toBe(undefined)
    })

    test("sets the auth credentials", () => {
      const auth: DrupalClient["auth"] = {
        username: "example",
        password: "pw",
      }
      const client = new DrupalClient(BASE_URL, {
        auth,
      })
      expect(client._auth).toMatchObject({
        ...auth,
        url: "/oauth/token",
      })
    })
  })

  describe("cache", () => {
    test("defaults to `null`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.cache).toBe(null)
    })

    test("sets the cache storage", () => {
      const customCache: DrupalClient["cache"] = {
        async get(key) {
          //
        },
        async set(key, value, ttl?: number) {
          //
        },
      }
      const client = new DrupalClient(BASE_URL, {
        cache: customCache,
      })
      expect(client.cache).toBe(customCache)
    })
  })

  describe("debug", () => {
    test("defaults to `false`", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
        //
      })

      new DrupalClient(BASE_URL)

      expect(consoleSpy).toBeCalledTimes(0)
    })

    test("turns on debug mode", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
        //
      })

      new DrupalClient(BASE_URL, { debug: true })

      expect(consoleSpy).toBeCalledTimes(1)
    })
  })

  describe("fetcher", () => {
    test("defaults to `undefined`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.fetcher).toBe(undefined)
    })

    test("sets up a custom fetcher", () => {
      const customFetcher: DrupalClient["fetcher"] = async () => {
        //
      }
      const client = new DrupalClient(BASE_URL, {
        fetcher: customFetcher,
      })
      expect(client.fetcher).toBe(customFetcher)
    })
  })

  describe("frontPage", () => {
    test('defaults to "/home"', () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.frontPage).toBe("/home")
    })

    test("sets up a custom frontPage", () => {
      const customFrontPage = "/front"

      const client = new DrupalClient(BASE_URL, {
        frontPage: customFrontPage,
      })
      expect(client.frontPage).toBe(customFrontPage)
    })
  })

  describe("headers", () => {
    test("defaults to `Content-Type`/`Accept`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client._headers).toMatchObject({
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      })
    })

    test("sets custom headers", () => {
      const customHeaders = {
        CustomContentType: "application/json",
        CustomAccept: "application/json",
      }

      const client = new DrupalClient(BASE_URL, {
        headers: customHeaders,
      })
      expect(client._headers).toMatchObject(customHeaders)
    })
  })

  describe("logger", () => {
    test("defaults to `console`-based `Logger`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.logger).toBe(defaultLogger)
    })

    test("sets up a custom logger", () => {
      const customLogger: Logger = {
        log: () => {
          //
        },
        debug: () => {
          //
        },
        warn: () => {
          //
        },
        error: () => {
          //
        },
      }

      const client = new DrupalClient(BASE_URL, {
        logger: customLogger,
      })
      expect(client.logger).toBe(customLogger)
    })
  })

  describe("previewSecret", () => {
    test("defaults to `undefined`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.previewSecret).toBe(undefined)
    })

    test("sets up a custom previewSecret", () => {
      const customPreviewSecret = "custom-secret-value"

      const client = new DrupalClient(BASE_URL, {
        previewSecret: customPreviewSecret,
      })
      expect(client.previewSecret).toBe(customPreviewSecret)
    })
  })

  describe("serializer", () => {
    test("defaults to `new Jsona()`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.serializer).toBeInstanceOf(Jsona)
    })

    test("sets up a custom serializer", () => {
      const customSerializer: DrupalClient["serializer"] = {
        deserialize(
          body: Record<string, unknown>,
          options?: Record<string, unknown>
        ): unknown {
          return {
            deserialized: true,
          }
        },
      }

      const client = new DrupalClient(BASE_URL, {
        serializer: customSerializer,
      })
      expect(client.serializer).toBe(customSerializer)
    })
  })

  describe("throwJsonApiErrors", () => {
    test("defaults to `true`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.throwJsonApiErrors).toBe(true)
    })

    test("can be set to `false`", () => {
      const client = new DrupalClient(BASE_URL, {
        throwJsonApiErrors: false,
      })
      expect(client.throwJsonApiErrors).toBe(false)
    })
  })

  describe("useDefaultResourceTypeEntry", () => {
    test("defaults to `false`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.useDefaultResourceTypeEntry).toBe(false)
    })

    test("can be set to `true`", () => {
      const client = new DrupalClient(BASE_URL, {
        useDefaultResourceTypeEntry: true,
      })
      expect(client.useDefaultResourceTypeEntry).toBe(true)
    })
  })

  describe("withAuth", () => {
    test("defaults to `false`", () => {
      const client = new DrupalClient(BASE_URL)
      expect(client.withAuth).toBe(false)
    })

    test("can be set to `true`", () => {
      const client = new DrupalClient(BASE_URL, {
        withAuth: true,
      })
      expect(client.withAuth).toBe(true)
    })
  })
})
