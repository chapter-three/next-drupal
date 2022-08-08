import { QueryData, QueryFormatter, QueryParams } from "@next-drupal/query"
import { drupal } from "lib/drupal"
import { DrupalMenuLinkContent } from "next-drupal"
import { MenuLink } from "types"

export const data: QueryData<null, DrupalMenuLinkContent[]> = async (): Promise<
  DrupalMenuLinkContent[]
> => {
  const { items } = await drupal.getMenu("main")

  return items
}

export const formatter: QueryFormatter<DrupalMenuLinkContent[], MenuLink[]> = (
  items
) => {
  return items.map((item) => ({
    text: item.title,
    url: item.url,
  }))
}
