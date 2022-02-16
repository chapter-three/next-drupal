import { DrupalMenuLinkContent, getMenu } from "next-drupal"

export async function getMenus(): Promise<{
  main: DrupalMenuLinkContent[]
}> {
  const { tree: mainMenu } = await getMenu("main")

  return {
    main: mainMenu,
  }
}
