import * as ParamsOnly from "./params-only"
import * as ParamsWithOpts from "./params-with-opts"
import * as ParamsNested from "./params-nested"
import * as DataOnly from "./data-only"
import * as DataWithOpts from "./data-with-opts"
import * as PlaceholderOnly from "./placeholder-only"
import * as PlaceholderWithOpts from "./placeholder-with-opts"
import * as DataWithPlaceholder from "./data-with-placeholder"
import * as FormatterOnly from "./formatter-only"
import * as DataWithFormatter from "./data-with-formatter"

import { createQueries } from "../../src"

export const queries = createQueries({
  "params-only": ParamsOnly,
  "params-with-opts": ParamsWithOpts,
  "params-nested": ParamsNested,
  "data-only": DataOnly,
  "data-with-opts": DataWithOpts,
  "placeholder-only": PlaceholderOnly,
  "placeholder-with-opts": PlaceholderWithOpts,
  "data-with-placeholder": DataWithPlaceholder,
  "formatter-only": FormatterOnly,
  "data-with-formatter": DataWithFormatter,
})
