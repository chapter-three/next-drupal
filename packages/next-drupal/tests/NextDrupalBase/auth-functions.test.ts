import { describe, expect, test } from "@jest/globals"
import { isAccessTokenAuth, isBasicAuth, isClientIdSecretAuth } from "../../src"
import { mocks } from "../utils"

const { accessToken, basicAuth, clientIdSecret } = mocks.auth

describe("isBasicAuth", () => {
  test("returns false if username is undefined", () => {
    expect(
      isBasicAuth(
        // @ts-expect-error
        { password: basicAuth.password }
      )
    ).toBe(false)
  })

  test("returns false if password is undefined", () => {
    expect(
      isBasicAuth(
        // @ts-expect-error
        { username: basicAuth.username }
      )
    ).toBe(false)
  })

  test("returns true if username and password are given", () => {
    expect(isBasicAuth(basicAuth)).toBe(true)
  })
})

describe("isAccessTokenAuth", () => {
  test("returns false if access_token is undefined", () => {
    expect(
      isAccessTokenAuth(
        // @ts-expect-error
        { token_type: accessToken.token_type }
      )
    ).toBe(false)
  })

  test("returns false if token_type is undefined", () => {
    expect(
      isAccessTokenAuth(
        // @ts-expect-error
        { access_token: accessToken.access_token }
      )
    ).toBe(false)
  })

  test("returns true if access_token and token_type are given", () => {
    expect(isAccessTokenAuth(accessToken)).toBe(true)
  })
})

describe("isClientIdSecretAuth", () => {
  test("returns false if clientId is undefined", () => {
    expect(
      isClientIdSecretAuth(
        // @ts-expect-error
        { clientSecret: clientIdSecret.clientSecret }
      )
    ).toBe(false)
  })

  test("returns false if clientSecret is undefined", () => {
    expect(
      isClientIdSecretAuth(
        // @ts-expect-error
        { clientId: clientIdSecret.clientId }
      )
    ).toBe(false)
  })

  test("returns true if clientId and clientSecret are given", () => {
    expect(isClientIdSecretAuth(clientIdSecret)).toBe(true)
  })
})
