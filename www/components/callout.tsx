interface CalloutProps {
  children?: React.ReactNode
}

export function Callout({ children, ...props }: CalloutProps) {
  return (
    <div
      className="flex flex-col items-center p-4 my-6 border border-l-4 rounded-md border-blue-50 bg-blue-50 callout"
      {...props}
    >
      {children}
    </div>
  )
}
