import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { NextDrupal } from "../../src"
import { BASE_URL, mockLogger } from "../utils"
import type { DrupalNode, JsonDeserializer } from "../../src"

jest.setTimeout(10000)

afterEach(() => {
  jest.restoreAllMocks()
})

describe("deserialize()", () => {
  test("deserializes JSON:API resource", async () => {
    const drupal = new NextDrupal(BASE_URL)
    const url = await drupal.buildEndpoint({
      resourceType: "node--article",
      path: "/52837ad0-f218-46bd-a106-5710336b7053",
      searchParams: {
        include: "field_tags",
      },
    })

    const response = await drupal.fetch(url)
    expect(response.status).toBe(200)
    const json = await response.json()
    const article = drupal.deserialize(json) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.field_tags).toHaveLength(3)
  })

  test("deserializes JSON:API collection", async () => {
    const drupal = new NextDrupal(BASE_URL)
    const url = await drupal.buildEndpoint({
      resourceType: "node--article",
      searchParams: {
        getQueryObject: () => ({
          "fields[node--article]": "title",
        }),
      },
    })

    const response = await drupal.fetch(url)
    expect(response.status).toBe(200)
    const json = await response.json()
    const articles = drupal.deserialize(json) as DrupalNode[]

    expect(articles).toMatchSnapshot()
  })

  test("allows for custom data serializer", async () => {
    const deserializer: JsonDeserializer = (
      body: { data: { id: string; attributes: { title: string } } },
      options: { pathPrefix: string }
    ) => {
      return {
        id: body.data.id,
        title: `${options.pathPrefix}: ${body.data.attributes.title}`,
      }
    }
    const drupal = new NextDrupal(BASE_URL, {
      deserializer,
    })
    const url = await drupal.buildEndpoint({
      resourceType: "node--article",
      path: "/52837ad0-f218-46bd-a106-5710336b7053",
    })

    const response = await drupal.fetch(url)
    expect(response.status).toBe(200)
    const json = await response.json()
    const article = drupal.deserialize(json, {
      pathPrefix: "TITLE",
    }) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.title).toEqual(`TITLE: ${json.data.attributes.title}`)
  })

  test("returns null if no body", () => {
    const drupal = new NextDrupal(BASE_URL)
    expect(drupal.deserialize("")).toBe(null)
  })
})

describe("logOrThrowError()", () => {
  test("throws the error", () => {
    const drupal = new NextDrupal(BASE_URL)
    expect(() => {
      drupal.logOrThrowError(new Error("Example error"))
    }).toThrow("Example error")
  })

  test("logs the error when throwJsonApiErrors is false", () => {
    const logger = mockLogger()
    const drupal = new NextDrupal(BASE_URL, {
      throwJsonApiErrors: false,
      logger,
    })
    expect(() => {
      drupal.logOrThrowError(new Error("Example error"))
    }).not.toThrow()
    expect(logger.error).toHaveBeenCalledWith(new Error("Example error"))
  })
})
