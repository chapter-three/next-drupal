import { PHASE_PRODUCTION_BUILD } from "next/constants"
import { DrupalMenuLinkContent } from "next-drupal"
import { drupal } from "lib/drupal"

export async function getMenu(name: string): Promise<DrupalMenuLinkContent[]> {
  const menu = await drupal.getMenu(name, {
    withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    cacheKey: `menu:${name}`,
  })

  return menu.items
}
