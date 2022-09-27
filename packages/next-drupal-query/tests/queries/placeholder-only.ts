import { QueryPlaceholderData } from "../../src"

export const placeholder: QueryPlaceholderData<
  null,
  { name: string }
> = async () => {
  return {
    name: "shadcn",
  }
}
