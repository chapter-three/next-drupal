import { Icon, useColorMode } from "reflexjs"

export type ModeToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function ModeToggle({ ...props }: ModeToggleProps) {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <button
      variant="button.icon"
      onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
      color="text"
      {...props}
    >
      <Icon name={colorMode === "light" ? "moon" : "sun"} size="5" />
    </button>
  )
}
