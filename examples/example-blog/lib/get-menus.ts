import { GetStaticPropsContext } from "next"
import { DrupalMenuLinkContent, getMenu } from "next-drupal"

export async function getMenus(context: GetStaticPropsContext): Promise<{
  blog: DrupalMenuLinkContent[]
  footer: DrupalMenuLinkContent[]
}> {
  const { tree: blog } = await getMenu("blog", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })
  const { tree: footer } = await getMenu("footer", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  })

  return {
    blog,
    footer,
  }
}
