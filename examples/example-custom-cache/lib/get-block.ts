import { PHASE_PRODUCTION_BUILD } from "next/constants"
import { DrupalBlock } from "next-drupal"

import { drupal } from "lib/drupal"

export async function getBlock(
  type: string,
  uuid: string
): Promise<DrupalBlock> {
  return await drupal.getResource(type, uuid, {
    withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    cacheKey: `block:${type}:${uuid}`,
  })
}
