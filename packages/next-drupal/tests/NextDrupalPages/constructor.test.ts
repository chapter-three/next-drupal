import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { Jsona } from "jsona"
import { NextDrupal, NextDrupalBase, NextDrupalPages } from "../../src"
import { BASE_URL } from "../utils"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("baseUrl parameter", () => {
  test("returns a NextDrupalPages", () => {
    expect(new NextDrupalPages(BASE_URL)).toBeInstanceOf(NextDrupalPages)
    expect(new NextDrupalPages(BASE_URL)).toBeInstanceOf(NextDrupal)
    expect(new NextDrupalPages(BASE_URL)).toBeInstanceOf(NextDrupalBase)
  })
})

describe("options parameter", () => {
  describe("serializer", () => {
    test("defaults to `new Jsona()`", () => {
      const drupal = new NextDrupalPages(BASE_URL)
      expect(
        // @ts-expect-error
        drupal.serializer
      ).toBeInstanceOf(Jsona)
    })

    test("sets up a custom serializer", () => {
      const customSerializer: NextDrupalPages["serializer"] = {
        deserialize(
          body: Record<string, unknown>,
          options?: Record<string, unknown>
        ): unknown {
          return {
            deserialized: true,
          }
        },
      }

      const drupal = new NextDrupalPages(BASE_URL, {
        serializer: customSerializer,
      })
      expect(
        // @ts-expect-error
        drupal.serializer
      ).toBe(customSerializer)
    })
  })
})
