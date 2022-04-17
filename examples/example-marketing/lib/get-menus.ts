import { GetStaticPropsContext } from "next"
import { DrupalMenuLinkContent } from "next-drupal"
import { drupal } from "lib/drupal"

export async function getMenus(context: GetStaticPropsContext): Promise<{
  main: DrupalMenuLinkContent[]
  footer: DrupalMenuLinkContent[]
}> {
  const { tree: main } = await drupal.getMenu("main", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
  const { tree: footer } = await drupal.getMenu("footer", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })

  return {
    main,
    footer,
  }
}
