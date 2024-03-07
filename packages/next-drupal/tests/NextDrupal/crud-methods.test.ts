import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals"
import { NextDrupal } from "../../src"
import {
  BASE_URL,
  deleteTestNodes,
  toggleDrupalModule,
  mocks,
  mockLogger,
  spyOnFetch,
} from "../utils"
import type { DrupalNode, JsonApiCreateFileResourceBody } from "../../src"

// Enabling and disabling modules takes longer.
// So we increase the timeout to 10 seconds to handle this.
jest.setTimeout(10000)

beforeAll(async () => {
  await toggleDrupalModule("basic_auth")
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await toggleDrupalModule("basic_auth", false)

  await deleteTestNodes()
})

describe("createResource()", () => {
  test("creates a resource", async () => {
    const drupal = new NextDrupal(BASE_URL)

    const article = await drupal.createResource<DrupalNode>(
      "node--article",
      {
        data: {
          attributes: {
            title: "TEST New article",
          },
        },
      },
      {
        withAuth: {
          username: process.env.DRUPAL_USERNAME,
          password: process.env.DRUPAL_PASSWORD,
        },
      }
    )

    expect(article.id).not.toBeNull()
    expect(article.title).toEqual("TEST New article")
  })

  test("creates a resource with a relationship", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    // Find an image media.
    const [mediaImage] = await drupal.getResourceCollection("media--image", {
      params: {
        "page[limit]": 1,
        "filter[status]": 1,
        "fields[media--image]": "name",
      },
    })

    const article = await drupal.createResource(
      "node--article",
      {
        data: {
          attributes: {
            title: "TEST: Article with media image",
          },
          relationships: {
            field_media_image: {
              data: {
                type: "media--image",
                id: mediaImage.id,
              },
            },
          },
        },
      },
      {
        params: {
          "fields[node--article]": "title,field_media_image",
          include: "field_media_image",
        },
      }
    )

    expect(article.field_media_image.id).toEqual(mediaImage.id)
    expect(article.field_media_image.name).toEqual(mediaImage.name)
  })

  test("creates a localized resource", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await drupal.createResource("node--article", {
      data: {
        attributes: {
          title: "TEST Article in spanish",
          langcode: "es",
        },
      },
    })

    expect(article.langcode).toEqual("es")
  })

  test("throws an error for missing required attributes", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      drupal.createResource("node--article", {
        data: {
          attributes: {},
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\ntitle: This value should not be null."
    )
  })

  test("throws an error for invalid attributes", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      drupal.createResource("node--article", {
        data: {
          attributes: {
            title: "TEST: Article",
            body: {
              value: ["invalid-array-value"],
            },
          },
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\nbody.0.value: This value should be of the correct primitive type."
    )

    await expect(
      drupal.createResource("node--article", {
        data: {
          attributes: {
            title: "TEST: Article",
            body: {
              value: "This is the body field",
              format: "invalid_format",
            },
          },
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\nbody.0.format: The value you selected is not a valid choice."
    )
  })
})

describe("createFileResource()", () => {
  const mockBody: JsonApiCreateFileResourceBody = {
    data: {
      attributes: {
        type: "file--file",
        field: "field_media_image",
        filename: "mediterranean-quiche-umami.jpg",
        file: Buffer.from("mock-file-data"),
      },
    },
  }
  const mockResponseData = mocks.resources.file

  test("constructs the API path from body and options", async () => {
    const logger = mockLogger()
    const drupal = new NextDrupal("https://example.com", {
      debug: true,
      logger,
    })
    const type = "type--from-first-argument"
    const fetchSpy = spyOnFetch({ responseBody: mockResponseData })

    await drupal.createFileResource(type, mockBody, {
      withAuth: false,
      params: { include: "extra_field" },
    })

    expect(logger.debug).toBeCalledWith(
      `Creating file resource for media of type ${type}.`
    )
    expect(fetchSpy.mock.lastCall[0]).toBe(
      "https://example.com/jsonapi/file/file/field_media_image?include=extra_field"
    )
  })

  test("constructs the API path using non-default locale", async () => {
    const drupal = new NextDrupal("https://example.com")
    const type = "type--from-first-argument"
    const fetchSpy = spyOnFetch({ responseBody: mockResponseData })

    await drupal.createFileResource(type, mockBody, {
      withAuth: false,
      params: { include: "extra_field" },
      locale: "es",
      defaultLocale: "en",
    })

    expect(fetchSpy.mock.lastCall[0]).toBe(
      "https://example.com/es/jsonapi/file/file/field_media_image?include=extra_field"
    )
  })

  test("returns the deserialized data", async () => {
    const drupal = new NextDrupal(BASE_URL)
    spyOnFetch({ responseBody: mockResponseData })

    const result = await drupal.createFileResource("ignored", mockBody, {
      withAuth: false,
    })

    expect(result?.filename).toBe(mockResponseData.data.attributes.filename)
    expect(result?.data?.attributes?.filename).toBe(undefined)
  })

  test("optionally returns the raw data", async () => {
    const drupal = new NextDrupal(BASE_URL)
    spyOnFetch({ responseBody: mockResponseData })

    const result = await drupal.createFileResource("ignored", mockBody, {
      withAuth: false,
      deserialize: false,
    })

    expect(result?.filename).toBe(undefined)
    expect(result?.data?.attributes?.filename).toBe(
      mockResponseData.data.attributes.filename
    )
  })

  test("throws error if response is not ok", async () => {
    const drupal = new NextDrupal(BASE_URL)
    const message = "mock error"
    spyOnFetch({
      responseBody: { message },
      status: 403,
      headers: {
        "content-type": "application/json",
      },
    })

    await expect(
      drupal.createFileResource("ignored", mockBody, {
        withAuth: false,
      })
    ).rejects.toThrow(message)
  })
})

describe("updateResource()", () => {
  test("updates a resource", async () => {
    const drupal = new NextDrupal(BASE_URL)

    const basic = Buffer.from(
      `${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`
    ).toString("base64")

    const article = await drupal.createResource<DrupalNode>(
      "node--article",
      {
        data: {
          attributes: {
            title: "TEST New article",
          },
        },
      },
      {
        withAuth: `Basic ${basic}`,
      }
    )

    const updatedArticle = await drupal.updateResource<DrupalNode>(
      "node--article",
      article.id,
      {
        data: {
          attributes: {
            title: "TEST New article updated",
          },
        },
      },
      {
        withAuth: `Basic ${basic}`,
      }
    )

    expect(article.id).toEqual(updatedArticle.id)
    expect(updatedArticle.title).toEqual("TEST New article updated")
  })

  test("updates a resource with a relationship", async () => {
    const basic = Buffer.from(
      `${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`
    ).toString("base64")

    const drupal = new NextDrupal(BASE_URL, {
      auth: `Basic ${basic}`,
    })

    // Create an article.
    const article = await drupal.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    // Find an image media.
    const [mediaImage] = await drupal.getResourceCollection("media--image", {
      params: {
        "page[limit]": 1,
        "filter[status]": 1,
        "fields[media--image]": "name",
      },
    })

    // Attach the media image to the article.
    const updatedArticle = await drupal.updateResource(
      "node--article",
      article.id,
      {
        data: {
          relationships: {
            field_media_image: {
              data: {
                type: "media--image",
                id: mediaImage.id,
              },
            },
          },
        },
      },
      {
        withAuth: {
          username: process.env.DRUPAL_USERNAME,
          password: process.env.DRUPAL_PASSWORD,
        },
        params: {
          "fields[node--article]": "title,field_media_image",
          include: "field_media_image",
        },
      }
    )

    expect(updatedArticle.id).toEqual(article.id)
    expect(updatedArticle.field_media_image.id).toEqual(mediaImage.id)
    expect(updatedArticle.field_media_image.name).toEqual(mediaImage.name)
  })

  test("throws an error for missing required attributes", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await drupal.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    await expect(
      drupal.updateResource("node--article", article.id, {
        data: {
          attributes: {
            title: null,
          },
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\ntitle: This value should not be null."
    )
  })

  test("throws an error for invalid attributes", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await drupal.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    await expect(
      drupal.updateResource("node--article", article.id, {
        data: {
          attributes: {
            body: {
              value: ["invalid-array-value"],
            },
          },
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\nbody.0.value: This value should be of the correct primitive type."
    )

    await expect(
      drupal.updateResource("node--article", article.id, {
        data: {
          attributes: {
            body: {
              value: "This is the body field",
              format: "invalid_format",
            },
          },
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\nbody.0.format: The value you selected is not a valid choice."
    )
  })
})

describe("deleteResource()", () => {
  test("deletes a resource", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await drupal.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    const deleted = await drupal.deleteResource("node--article", article.id)

    expect(deleted).toBe(true)

    await expect(
      drupal.getResource("node--article", article.id)
    ).rejects.toThrow(
      '404 Not Found\nThe "entity" parameter was not converted for the path "/jsonapi/node/article/{entity}" (route name: "jsonapi.node--article.individual")'
    )
  })

  test("throws an error for invalid resource", async () => {
    const drupal = new NextDrupal(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      drupal.deleteResource("node--article", "invalid-id")
    ).rejects.toThrow(
      '404 Not Found\nThe "entity" parameter was not converted for the path "/jsonapi/node/article/{entity}" (route name: "jsonapi.node--article.individual.delete")'
    )
  })
})
