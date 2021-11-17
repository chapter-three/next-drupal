import { Icon } from "reflexjs"

interface CalloutProps {
  type?: "primary" | "accent"
  icon?: string
  children?: React.ReactNode
}

export function Callout({ type = "primary", icon, children }: CalloutProps) {
  return (
    <div
      display="flex"
      alignItems="center"
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
      {icon ? <Icon name={icon} width="6" height="6" mr="4" /> : null}
      <div
        sx={{
          p: {
            fontSize: "md",
            lineHeight: "normal",
            mt: 0,
            mb: 2,
          },
          "> p:last-child": {
            mb: 0,
          },
        }}
      >
        {children}
      </div>
    </div>
  )
}
