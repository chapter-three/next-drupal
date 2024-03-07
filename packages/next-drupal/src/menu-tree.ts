import type { DrupalMenuItem, DrupalMenuItemId } from "./types"

export class DrupalMenuTree<
  T extends {
    id: DrupalMenuItemId
    parent: DrupalMenuItemId
    items?: T[]
  } = DrupalMenuItem,
> extends Array {
  parentId: DrupalMenuItemId
  depth: number

  constructor(
    menuItems: T[],
    parentId: DrupalMenuItemId = "",
    depth: number = 1
  ) {
    super()

    this.parentId = parentId
    this.depth = depth

    if (menuItems?.length) {
      this.build(menuItems, parentId)
    }
  }

  build(menuItems: T[], parentId: DrupalMenuItemId) {
    // Find the children of the specified parent.
    const children = menuItems.filter(
      (menuItem) => menuItem?.parent === parentId
    )

    // Add each child to this Array.
    for (const menuItem of children) {
      const subtree = new DrupalMenuTree<T>(
        menuItems,
        menuItem.id,
        this.depth + 1
      )

      this.push({
        ...menuItem,
        items: subtree.length ? subtree : undefined,
      })
    }
  }
}
