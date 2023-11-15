import { expect } from "@jest/globals"
import { DrupalClient } from "next-drupal-build-testing"
import type { DrupalNode } from "../src/types"
import { BASE_URL, deleteTestNodes, toggleDrupalModule } from "./utils"

// Enabling and disabling modules takes longer.
// So we increase the time out to handle this.
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

describe("createResource", () => {
  test("it creates a resource", async () => {
    const client = new DrupalClient(BASE_URL)

    const article = await client.createResource<DrupalNode>(
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

  test("it creates a resource with a relationship", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    // Find an image media.
    const [mediaImage] = await client.getResourceCollection("media--image", {
      params: {
        "page[limit]": 1,
        "filter[status]": 1,
        "fields[media--image]": "name",
      },
    })

    const article = await client.createResource(
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

  test("it creates a localized resource", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await client.createResource("node--article", {
      data: {
        attributes: {
          title: "TEST Article in spanish",
          langcode: "es",
        },
      },
    })

    expect(article.langcode).toEqual("es")
  })

  test("it throws an error for missing required attributes", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      client.createResource("node--article", {
        data: {
          attributes: {},
        },
      })
    ).rejects.toThrow(
      "422 Unprocessable Entity\ntitle: This value should not be null."
    )
  })

  test("it throws an error for invalid attributes", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      client.createResource("node--article", {
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
      client.createResource("node--article", {
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

describe("updateResource", () => {
  test("it updates a resource", async () => {
    const client = new DrupalClient(BASE_URL)

    const basic = Buffer.from(
      `${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`
    ).toString("base64")

    const article = await client.createResource<DrupalNode>(
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

    const updatedArticle = await client.updateResource<DrupalNode>(
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

  test("it updates a resource with a relationship", async () => {
    const basic = Buffer.from(
      `${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`
    ).toString("base64")

    const client = new DrupalClient(BASE_URL, {
      auth: `Basic ${basic}`,
    })

    // Create an article.
    const article = await client.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    // Find an image media.
    const [mediaImage] = await client.getResourceCollection("media--image", {
      params: {
        "page[limit]": 1,
        "filter[status]": 1,
        "fields[media--image]": "name",
      },
    })

    // Attach the media image to the article.
    const updatedArticle = await client.updateResource(
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

  test("it throws an error for missing required attributes", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await client.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    await expect(
      client.updateResource("node--article", article.id, {
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

  test("it throws an error for invalid attributes", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await client.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    await expect(
      client.updateResource("node--article", article.id, {
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
      client.updateResource("node--article", article.id, {
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

describe("deleteResource", () => {
  test("it deletes a resource", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    const article = await client.createResource<DrupalNode>("node--article", {
      data: {
        attributes: {
          title: "TEST New article",
        },
      },
    })

    const deleted = await client.deleteResource("node--article", article.id)

    expect(deleted).toBe(true)

    await expect(
      client.getResource("node--article", article.id)
    ).rejects.toThrow(
      '404 Not Found\nThe "entity" parameter was not converted for the path "/jsonapi/node/article/{entity}" (route name: "jsonapi.node--article.individual")'
    )
  })

  test("it throws an error for invalid resource", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: process.env.DRUPAL_USERNAME,
        password: process.env.DRUPAL_PASSWORD,
      },
    })

    await expect(
      client.deleteResource("node--article", "invalid-id")
    ).rejects.toThrow(
      '404 Not Found\nThe "entity" parameter was not converted for the path "/jsonapi/node/article/{entity}" (route name: "jsonapi.node--article.individual.delete")'
    )
  })
})
