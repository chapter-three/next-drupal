import React from "react"

interface FormItemProps {
  label: string
  name: string
  children?: React.ReactNode
}
export function FormItem({ label, name, children, ...props }: FormItemProps) {
  return (
    <div display="grid" row="repeat(2, auto)" gap="2" {...props}>
      <label
        htmlFor={name}
        fontWeight="semibold"
        textTransform="uppercase"
        fontSize="sm"
        px="1"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
