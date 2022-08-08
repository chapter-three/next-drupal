type FieldCardinality = "limited" | "unlimited"

export interface FieldTextFormatted {
  value: string
  processed: string
  format: string
}

export type FieldEntityReference<
  Types,
  Cardinality extends FieldCardinality = "limited"
> = Cardinality extends "unlimited" ? Array<Partial<Types>> : Partial<Types>

export type FieldList<List> = keyof List
