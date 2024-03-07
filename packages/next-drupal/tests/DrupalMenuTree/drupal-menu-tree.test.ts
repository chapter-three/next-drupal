import { describe, expect, test } from "@jest/globals"
import { DrupalMenuTree } from "../../src/menu-tree"
import type { DrupalMenuItem } from "../../src"

const menuItems = [
  { id: "1", parent: "" },
  { id: "2", parent: "" },
  { id: "3", parent: "" },
  { id: "4", parent: "1" },
  { id: "5", parent: "1" },
  { id: "6", parent: "1" },
  { id: "7", parent: "4" },
]

test("extends Array", () => {
  const tree = new DrupalMenuTree<DrupalMenuItem>([])

  expect(Array.isArray(tree)).toBe(true)
})

describe("parentId parameter", () => {
  test("has no parent ID by default", () => {
    const tree = new DrupalMenuTree<DrupalMenuItem>([])

    expect(tree.parentId).toBe("")
  })

  test("has the given parent ID", () => {
    const tree = new DrupalMenuTree<DrupalMenuItem>([], "42")

    expect(tree.parentId).toBe("42")
  })

  test("child trees have the correct parentId", () => {
    const tree = new DrupalMenuTree(menuItems)

    expect(tree[0]?.items?.parentId).toBe("1")
    expect(tree[0]?.items?.[0]?.items?.parentId).toBe("4")
  })
})

describe("depth parameter", () => {
  test("has a depth of 1 by default", () => {
    const tree = new DrupalMenuTree<DrupalMenuItem>([])

    expect(tree.depth).toBe(1)
  })

  test("child trees have the correct depth", () => {
    const tree = new DrupalMenuTree(menuItems)

    expect(tree[0]?.items?.depth).toBe(2)
    expect(tree[0]?.items?.[0]?.items?.depth).toBe(3)
  })
})

test("assembles a tree", async () => {
  const tree = new DrupalMenuTree(menuItems)

  expect(tree).toMatchInlineSnapshot(`
DrupalMenuTree [
  {
    "id": "1",
    "items": DrupalMenuTree [
      {
        "id": "4",
        "items": DrupalMenuTree [
          {
            "id": "7",
            "items": undefined,
            "parent": "4",
          },
        ],
        "parent": "1",
      },
      {
        "id": "5",
        "items": undefined,
        "parent": "1",
      },
      {
        "id": "6",
        "items": undefined,
        "parent": "1",
      },
    ],
    "parent": "",
  },
  {
    "id": "2",
    "items": undefined,
    "parent": "",
  },
  {
    "id": "3",
    "items": undefined,
    "parent": "",
  },
]
`)
})
