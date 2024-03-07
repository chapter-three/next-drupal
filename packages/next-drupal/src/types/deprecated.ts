import type { JsonApiOptions } from "./options"
import { DrupalMenuItem } from "./drupal"

export type JsonApiWithLocaleOptions = Omit<JsonApiOptions, "withAuth">

export type DrupalMenuLinkContent = DrupalMenuItem
