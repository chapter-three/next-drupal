interface FormItemProps {
  label: string
  name: string
  children?: React.ReactNode
}

export function FormItem({ label, name, children, ...props }: FormItemProps) {
  return (
    <div className="grid gap-2" {...props}>
      <label className="text-sm font-semibold uppercase" htmlFor={name}>
        {label}
      </label>
      {children}
    </div>
  )
}
