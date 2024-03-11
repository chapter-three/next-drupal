import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { Jsona } from "jsona"
import { DrupalClient, NextDrupal, NextDrupalFetch } from "../../src"
import { BASE_URL } from "../utils"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("baseUrl parameter", () => {
  test("returns a DrupalClient", () => {
    expect(new DrupalClient(BASE_URL)).toBeInstanceOf(DrupalClient)
    expect(new DrupalClient(BASE_URL)).toBeInstanceOf(NextDrupal)
    expect(new DrupalClient(BASE_URL)).toBeInstanceOf(NextDrupalFetch)
  })
})

describe("options parameter", () => {
  describe("serializer", () => {
    test("defaults to `new Jsona()`", () => {
      const drupal = new DrupalClient(BASE_URL)
      expect(drupal.serializer).toBeInstanceOf(Jsona)
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

      const drupal = new DrupalClient(BASE_URL, {
        serializer: customSerializer,
      })
      expect(drupal.serializer).toBe(customSerializer)
    })
  })
})
