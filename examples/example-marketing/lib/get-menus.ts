import { GetStaticPropsContext } from "next"
import { DrupalMenuLinkContent, getMenu } from "next-drupal"

export async function getMenus(context: GetStaticPropsContext): Promise<{
  main: DrupalMenuLinkContent[]
  footer: DrupalMenuLinkContent[]
}> {
  const { tree: main } = await getMenu("main", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
  const { tree: footer } = await getMenu("footer", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })

  return {
    main,
    footer,
  }
}
