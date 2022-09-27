import { QueryFormatter } from "../../src"

type Input = {
  firstName: string
  lastName: string
}

type Output = {
  name: string
}

export const formatter: QueryFormatter<Input, Output> = (input) => {
  return {
    name: `${input.firstName} ${input.lastName}`,
  }
}
