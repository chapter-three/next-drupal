import { QueryParams } from "../../src"
import { queries } from "."

export const params: QueryParams<null> = () => {
  return queries.getParams("params-only").addPageLimit(10)
}
