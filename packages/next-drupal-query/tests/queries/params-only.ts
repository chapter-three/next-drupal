import { QueryParams } from "../../src"
import { queries } from "."

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(["field_image", "uid"])
}
