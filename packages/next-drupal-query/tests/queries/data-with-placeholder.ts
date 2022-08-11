import { QueryData, QueryOpts, QueryPlaceholderData } from "../../src"

type ParamOpts = QueryOpts<{
  email: string
}>

export const data: QueryData<ParamOpts, { email: string }> = async (
  opts
): Promise<{
  email: string
}> => {
  return {
    email: opts.email,
  }
}

export const placeholder: QueryPlaceholderData<
  ParamOpts,
  { name: string; email: string }
> = async (opts) => {
  return {
    name: "placeholder",
    email: opts.email,
  }
}
