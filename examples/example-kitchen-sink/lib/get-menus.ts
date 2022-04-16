import { drupal } from "lib/drupal"
import { GetServerSidePropsContext, GetStaticPropsContext } from "next"

interface GetMenusOptions {
  locale: GetStaticPropsContext["locale"]
  defaultLocale: GetServerSidePropsContext["defaultLocale"]
}

// Every page needs a main and footer menu.
// We can abstract the data fetching here.
export async function getMenus({ locale, defaultLocale }: GetMenusOptions) {
  // We only care about the title and url for Link.
  const params = {
    "fields[menu_link_content--menu_link_content]": "title,url",
  }

  const mainMenu = await drupal.getMenu("foodieland-main", {
    params,
    locale,
    defaultLocale,
  })

  const footerMenu = await drupal.getMenu("foodieland-footer", {
    params,
    locale,
    defaultLocale,
  })

  return {
    main: mainMenu.items,
    footer: footerMenu.items,
  }
}
