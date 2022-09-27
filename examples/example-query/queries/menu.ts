import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryPlaceholderData,
} from "next-drupal-query"
import { drupal } from "lib/drupal"
import { DrupalMenuLinkContent } from "next-drupal"
import { MenuLink } from "types"

type ParamOpts = QueryOpts<{
  name: "main" | "footer"
}>

export const data: QueryData<ParamOpts, DrupalMenuLinkContent[]> = async (
  opts
): Promise<DrupalMenuLinkContent[]> => {
  const { items } = await drupal.getMenu(opts.name)

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

export const placeholder: QueryPlaceholderData<
  QueryOpts<{ title: string }>,
  MenuLink[]
> = async (opts) => {
  return [
    {
      text: opts.title,
      url: "/about",
    },
    {
      text: "Bar",
      url: "/new",
    },
  ]
}
