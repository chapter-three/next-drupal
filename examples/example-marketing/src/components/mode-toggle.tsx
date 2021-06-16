import { Icon, useColorMode, VisuallyHidden } from "reflexjs"

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
      <VisuallyHidden>Toggle Mode</VisuallyHidden>
      <Icon name={colorMode === "light" ? "moon" : "sun"} size="5" />
    </button>
  )
}
