import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { DrupalClient } from "../../src"
import { BASE_URL, mocks, spyOnFetch } from "../utils"
import type { DrupalNode, DrupalSearchApiJsonApiResponse } from "../../src"

jest.setTimeout(10000)

afterEach(() => {
  jest.restoreAllMocks()
})

describe("buildMenuTree()", () => {
  test.todo("add tests")
})

describe("getEntryForResourceType()", () => {
  test("returns the JSON:API entry for a resource type", async () => {
    const client = new DrupalClient(BASE_URL)
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--recipe")
    expect(recipeEntry).toMatch(`${BASE_URL}/en/jsonapi/node/recipe`)
    expect(getIndexSpy).toHaveBeenCalledTimes(1)

    const articleEntry = await client.getEntryForResourceType("node--article")
    expect(articleEntry).toMatch(`${BASE_URL}/en/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(2)
  })

  test("assembles JSON:API entry without fetching index", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
    })
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--article")
    expect(recipeEntry).toMatch(`${BASE_URL}/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(0)
  })

  test("throws an error if resource type does not exist", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getEntryForResourceType("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })
})

describe("getIndex()", () => {
  test("fetches the JSON:API index", async () => {
    const client = new DrupalClient(BASE_URL)
    const index = await client.getIndex()

    expect(index).toMatchSnapshot()
  })

  test("fetches the JSON:API index with locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const index = await client.getIndex("es")

    expect(index).toMatchSnapshot()
  })

  test("throws error for invalid base url", async () => {
    const client = new DrupalClient("https://example.com")

    await expect(client.getIndex()).rejects.toThrow(
      "Failed to fetch JSON:API index at https://example.com/jsonapi"
    )
  })
})

describe("getMenu()", () => {
  test("fetches menu items for a menu", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main")

    expect(menu).toMatchSnapshot()
  })

  test("fetches menu items for a menu with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main", {
      locale: "es",
      defaultLocale: "en",
    })

    expect(menu).toMatchSnapshot()
  })

  test("fetches menu items for a menu with params", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main", {
      params: {
        "fields[menu_link_content--menu_link_content]": "title",
      },
    })

    expect(menu).toMatchSnapshot()
  })

  test("throws an error for invalid menu name", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getMenu("INVALID")).rejects.toThrow(
      '404 Not Found\nThe "menu" parameter was not converted for the path "/jsonapi/menu_items/{menu}" (route name: "jsonapi_menu_items.menu")'
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getMenu("main")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getMenu("main", { withAuth: true })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("getResource()", () => {
  test("fetches a resource by uuid", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource by uuid with params", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource using locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        locale: "es",
        defaultLocale: "en",
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          deserialize: false,
        }
      )
    ).resolves.toMatchSnapshot()
  })

  test("fetches a resource by revision", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )
    const latestRevision = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          resourceVersion: "rel:latest-version",
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    expect(recipe.drupal_internal__vid).toEqual(
      latestRevision.drupal_internal__vid
    )
  })

  test("throws an error for invalid revision", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          params: {
            resourceVersion: "id:-11",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("throws an error if revision access is forbidden", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          params: {
            resourceVersion: "id:1",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "403 Forbidden\nThe current user is not allowed to GET the selected resource. The user does not have access to the requested version."
    )
  })

  test("throws an error for invalid resource type", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "RESOURCE-DOES-NOT-EXIST",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
      )
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          params: {
            include: "invalid_relationship",
          },
        }
      )
    ).rejects.toThrow(
      "400 Bad Request\n`invalid_relationship` is not a valid relationship field name. Possible values: node_type, revision_uid, uid, menu_link, field_media_image, field_recipe_category, field_tags."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getResource(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
    )
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getResource(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("getResourceByPath()", () => {
  test("fetches a resource by path", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche")
    ).resolves.toMatchSnapshot()
  })

  test("fetches a resource by path with params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche", {
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      })
    ).resolves.toMatchSnapshot()
  })

  test("fetches a resource by path using locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResourceByPath(
      "/recipes/quiche-mediterráneo-profundo",
      {
        locale: "es",
        defaultLocale: "en",
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche", {
        deserialize: false,
      })
    ).resolves.toMatchSnapshot()
  })

  test("fetches a resource by revision", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )
    const latestRevision = await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        params: {
          resourceVersion: "rel:latest-version",
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    expect(recipe.drupal_internal__vid).toEqual(
      latestRevision.drupal_internal__vid
    )
  })

  test("throws an error for invalid revision", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
        {
          params: {
            resourceVersion: "id:-11",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("throws an error if revision access is forbidden", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
        {
          params: {
            resourceVersion: "id:1",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "403 Forbidden\nThe current user is not allowed to GET the selected resource. The user does not have access to the requested version."
    )
  })

  test("returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>("/path-do-not-exist")
    ).rejects.toThrow("Unable to resolve path /path-do-not-exist.")
  })

  test("throws an error for server errors", async () => {
    const client = new DrupalClient(BASE_URL)

    spyOnFetch({
      responseBody: { message: "mocked internal server error" },
      status: 500,
    })

    await expect(
      client.getResourceByPath<DrupalNode>("/server-error")
    ).rejects.toThrow("500 mocked internal server error")
  })

  test("throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
        {
          params: {
            include: "invalid_relationship",
          },
        }
      )
    ).rejects.toThrow(
      "400 Bad Request\n`invalid_relationship` is not a valid relationship field name. Possible values: node_type, revision_uid, uid, menu_link, field_media_image, field_recipe_category, field_tags."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")
    const getAccessTokenSpy = jest.spyOn(client, "getAccessToken")

    await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche"
    )
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.anything(),
        }),
      })
    )
    expect(getAccessTokenSpy).not.toHaveBeenCalled()
  })

  test("makes authenticated requests with withAuth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: mocks.auth.clientIdSecret,
    })
    const fetchSpy = spyOnFetch()
    const getAccessTokenSpy = jest
      .spyOn(client, "getAccessToken")
      .mockImplementation(async () => mocks.auth.accessToken)

    await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `${mocks.auth.accessToken.token_type} ${mocks.auth.accessToken.access_token}`,
        }),
      })
    )
    expect(getAccessTokenSpy).toHaveBeenCalled()
  })

  test("returns null if path is falsey", async () => {
    const client = new DrupalClient(BASE_URL)

    const resource = await client.getResourceByPath("")
    expect(resource).toBe(null)
  })
})

describe("getResourceCollection()", () => {
  test("fetches a resource collection", async () => {
    const client = new DrupalClient(BASE_URL)

    const articles = await client.getResourceCollection("node--article", {
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(articles).toMatchSnapshot()
  })

  test("fetches a resource collection using locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const articles = await client.getResourceCollection("node--article", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--article]": "title,langcode",
      },
    })

    expect(articles[0].langcode).toEqual("es")

    expect(articles).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    const recipes = await client.getResourceCollection("node--recipe", {
      deserialize: false,
      params: {
        "fields[node--recipe]": "title",
        "page[limit]": 2,
      },
    })

    expect(recipes).toMatchSnapshot()
  })

  test("throws an error for invalid resource type", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceCollection("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceCollection<DrupalNode>("node--recipe", {
        params: {
          include: "invalid_relationship",
        },
      })
    ).rejects.toThrow(
      "400 Bad Request\n`invalid_relationship` is not a valid relationship field name. Possible values: node_type, revision_uid, uid, menu_link, field_media_image, field_recipe_category, field_tags."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getResourceCollection("node--recipe")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getResourceCollection("node--recipe", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("getSearchIndex()", () => {
  test("fetches a search index", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      params: {
        "fields[node--recipe]": "title",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("fetches a search index with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--recipe]": "title",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("fetches a search index with facets filters", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex<DrupalSearchApiJsonApiResponse>(
      "recipes",
      {
        deserialize: false,
        params: {
          "filter[difficulty]": "easy",
          "fields[node--recipe]": "title,field_difficulty",
        },
      }
    )

    expect(search).toMatchSnapshot()
    expect(search.meta.facets).not.toBeNull()
  })

  test("fetches raw data from search index", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      deserialize: false,
      params: {
        "filter[difficulty]": "easy",
        "fields[node--recipe]": "title,field_difficulty",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getSearchIndex("recipes")

    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("throws an error for invalid index", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getSearchIndex("INVALID-INDEX")).rejects.toThrow(
      "Not Found"
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getSearchIndex("recipes", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("getView()", () => {
  test("fetches a view", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1")

    expect(view).toMatchSnapshot()
  })

  test("fetches a view with params", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("fetches a view with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      locale: "es",
      defaultLocale: "en",
      deserialize: false,
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("throws an error for invalid view name", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getView("INVALID")).rejects.toThrow("Not Found")
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getView("featured_articles--page_1")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getView("featured_articles--page_1", { withAuth: true })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })

  test("fetches a view with links for pagination", async () => {
    const client = new DrupalClient(BASE_URL)
    const view = await client.getView("recipes--page_1")

    expect(view.links).toHaveProperty("next")
  })
})

describe("translatePath()", () => {
  test("translates a path", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = await client.translatePath("recipes/deep-mediterranean-quiche")

    expect(path).toMatchSnapshot()

    const path2 = await client.translatePath(
      "/recipes/deep-mediterranean-quiche"
    )

    expect(path).toEqual(path2)
  })

  test("returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = await client.translatePath("/path-not-found")

    expect(path).toBeNull()
  })

  test("throws an error for server errors", async () => {
    const client = new DrupalClient(BASE_URL)

    spyOnFetch({
      responseBody: { message: "mocked internal server error" },
      status: 500,
    })

    await expect(client.translatePath("/server-error")).rejects.toThrowError(
      "500 mocked internal server error"
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.translatePath("recipes/deep-mediterranean-quiche")

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.translatePath("recipes/deep-mediterranean-quiche", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})
