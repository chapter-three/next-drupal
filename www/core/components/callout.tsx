interface CalloutProps {
  type?: "primary" | "accent"
  children?: React.ReactNode
}

export function Callout({ type = "primary", children }: CalloutProps) {
  return (
    <div
      borderLeftWidth="6"
      borderLeftColor={type}
      rounded="sm"
      bg="muted"
      p="4"
      sx={{
        "> p": {
          mt: 0,
          mb: 2,
          fontSize: "md",
        },
        "> p:last-child": {
          mb: 0,
        },
      }}
    >
      {children}
    </div>
  )
}
