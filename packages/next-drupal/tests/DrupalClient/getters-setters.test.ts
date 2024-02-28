import { afterEach, describe, expect, jest, test } from "@jest/globals"
import {
  AccessToken,
  DrupalClient,
  DrupalClientAuthAccessToken,
  DrupalClientAuthUsernamePassword,
  DrupalClientOptions,
} from "../../src"
import { BASE_URL, mocks } from "../utils"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("apiPrefix", () => {
  test("get apiPrefix", () => {
    const client = new DrupalClient(BASE_URL)
    expect(client.apiPrefix).toBe("/jsonapi")
  })
  test("set apiPrefix", () => {
    const client = new DrupalClient(BASE_URL)
    client.apiPrefix = "/api"
    expect(client.apiPrefix).toBe("/api")
  })
  test('set apiPrefix and prefixes with "/"', () => {
    const client = new DrupalClient(BASE_URL)
    client.apiPrefix = "api"
    expect(client.apiPrefix).toBe("/api")
  })
})

describe("auth", () => {
  describe("throws an error if invalid Basic Auth", () => {
    test("missing username", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          password: "password",
        }
      }).toThrow(
        "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing password", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          username: "admin",
        }
      }).toThrow(
        "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  describe("throws an error if invalid Access Token", () => {
    test("missing access_token", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          token_type: mocks.auth.accessToken.token_type,
        }
      }).toThrow(
        "'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing token_type", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          access_token: mocks.auth.accessToken.access_token,
        }
      }).toThrow(
        "'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  describe("throws an error if invalid Client ID/Secret", () => {
    test("missing clientId", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          clientSecret: mocks.auth.clientIdSecret.clientSecret,
        }
      }).toThrow(
        "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing clientSecret", () => {
      expect(() => {
        const client = new DrupalClient(BASE_URL)
        // @ts-ignore
        client.auth = {
          clientId: mocks.auth.clientIdSecret.clientId,
        }
      }).toThrow(
        "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  test("sets Basic Auth", () => {
    const basicAuth: DrupalClientAuthUsernamePassword = {
      ...mocks.auth.basicAuth,
    }
    const client = new DrupalClient(BASE_URL)
    client.auth = basicAuth
    expect(client._auth).toMatchObject({ ...basicAuth })
  })

  test("sets Access Token", () => {
    const accessToken = {
      ...mocks.auth.accessToken,
    }
    const client = new DrupalClient(BASE_URL)
    client.auth = accessToken
    expect(client._auth).toMatchObject({ ...accessToken })
  })

  test("sets Client ID/Secret", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
    }
    const client = new DrupalClient(BASE_URL)
    client.auth = clientIdSecret
    expect(client._auth).toMatchObject({ ...clientIdSecret })
  })

  test("sets auth function", () => {
    const authFunction = mocks.auth.function
    const client = new DrupalClient(BASE_URL)
    client.auth = authFunction
    expect(client._auth).toBe(authFunction)
  })

  test("sets custom Authorization string", () => {
    const authString = `${mocks.auth.customAuthenticationHeader}`
    const client = new DrupalClient(BASE_URL)
    client.auth = authString
    expect(client._auth).toBe(authString)
  })

  test("sets a default access token url", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
    }
    const client = new DrupalClient(BASE_URL)
    client.auth = clientIdSecret
    expect(client._auth.url).toBe("/oauth/token")
  })

  test("can override the default access token url", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
      url: "/custom/oauth/token",
    }
    const client = new DrupalClient(BASE_URL)
    client.auth = clientIdSecret
    expect(client._auth.url).toBe("/custom/oauth/token")
  })
})

describe("headers", () => {
  describe("set headers", () => {
    test("using key-value pairs", () => {
      const headers = [
        ["Content-Type", "application/x-www-form-urlencoded"],
        ["Accept", "application/json"],
      ] as DrupalClientOptions["headers"]
      const client = new DrupalClient(BASE_URL)
      client.headers = headers
      expect(client._headers).toBe(headers)
    })

    test("using object literal", () => {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      } as DrupalClientOptions["headers"]
      const client = new DrupalClient(BASE_URL)
      client.headers = headers
      expect(client._headers).toBe(headers)
    })

    test("using Headers object", () => {
      const headers = new Headers()
      headers.append("Content-Type", "application/x-www-form-urlencoded")
      headers.append("Accept", "application/json")

      const client = new DrupalClient(BASE_URL)
      client.headers = headers
      expect(client._headers).toBe(headers)
    })
  })
})

describe("token", () => {
  test("set token", () => {
    function getExpiresOn(token: AccessToken): number {
      return Date.now() + token.expires_in * 1000
    }

    const accessToken = {
      ...mocks.auth.accessToken,
    } as DrupalClientAuthAccessToken
    const before = getExpiresOn(accessToken)

    const client = new DrupalClient(BASE_URL)
    client.token = accessToken
    expect(client._token).toBe(accessToken)
    expect(client.tokenExpiresOn).toBeGreaterThanOrEqual(before)
    expect(client.tokenExpiresOn).toBeLessThanOrEqual(getExpiresOn(accessToken))
  })
})
