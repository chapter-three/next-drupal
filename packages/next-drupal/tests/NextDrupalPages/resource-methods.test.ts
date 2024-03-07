import { describe, expect, jest, test } from "@jest/globals"
import { NextDrupalPages } from "../../src"
import { BASE_URL } from "../utils"

describe("getEntryForResourceType()", () => {
  test("returns the JSON:API entry for a resource type", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const getIndexSpy = jest.spyOn(drupal, "getIndex")

    const recipeEntry = await drupal.getEntryForResourceType("node--recipe")
    expect(recipeEntry).toMatch(`${BASE_URL}/en/jsonapi/node/recipe`)
    expect(getIndexSpy).toHaveBeenCalledTimes(1)

    const articleEntry = await drupal.getEntryForResourceType("node--article")
    expect(articleEntry).toMatch(`${BASE_URL}/en/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(2)
  })

  test("assembles JSON:API entry without fetching index", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
    })
    const getIndexSpy = jest.spyOn(drupal, "getIndex")

    const recipeEntry = await drupal.getEntryForResourceType("node--article")
    expect(recipeEntry).toMatch(`${BASE_URL}/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(0)
  })

  test("throws an error if resource type does not exist", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    await expect(
      drupal.getEntryForResourceType("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })
})
