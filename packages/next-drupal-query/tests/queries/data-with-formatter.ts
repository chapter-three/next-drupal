import { QueryData, QueryFormatter, QueryOpts } from "../../src"

type ParamOpts = QueryOpts<{
  email: string
}>

type RawUserData = {
  firstName: string
  lastName: string
  email: string
}

export const data: QueryData<ParamOpts, RawUserData> = async (
  opts
): Promise<RawUserData> => {
  return {
    firstName: "First",
    lastName: "Last",
    email: opts?.email || "n/a",
  }
}

type FormattedUserData = {
  name: string
  email: string
}

export const formatter: QueryFormatter<RawUserData, FormattedUserData> = (
  input
) => {
  return {
    name: `${input.firstName} ${input.lastName}`,
    email: input.email,
  }
}
