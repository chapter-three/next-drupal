import { PathAlias } from "next-drupal"

import { DrupalJsonApiResource } from "./base"

export interface DrupalUser extends DrupalJsonApiResource {
  type: "user--user"
  display_name: string
  name: string
  mail: string
  created: string
  changed: string
  path?: PathAlias
}
