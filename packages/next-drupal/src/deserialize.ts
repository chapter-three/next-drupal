import Jsona from "jsona"

const dataFormatter = new Jsona()

export function deserialize(body, options?) {
  return dataFormatter.deserialize(body, options)
}
