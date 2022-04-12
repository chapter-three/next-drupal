import { drupal } from "lib/drupal"

// Every page needs a main and footer menu.
// We can abstract the data fetching here.
export async function getMenus() {
  // We only care about the title and url for Link.
  const params = {
    "fields[menu_link_content--menu_link_content]": "title,url",
  }

  const mainMenu = await drupal.getMenu("foodieland-main", {
    params,
  })

  const footerMenu = await drupal.getMenu("foodieland-footer", {
    params,
  })

  return {
    main: mainMenu.items,
    footer: footerMenu.items,
  }
}
