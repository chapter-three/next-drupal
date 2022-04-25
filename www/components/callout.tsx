interface CalloutProps {
  icon?: string
  children?: React.ReactNode
}

export function Callout({ children, icon, ...props }: CalloutProps) {
  return (
    <div
      className="flex items-center p-4 my-6 border border-l-4 border-blue-400 rounded-md bg-blue-50 callout"
      {...props}
    >
      {icon && <span className="mr-2 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
