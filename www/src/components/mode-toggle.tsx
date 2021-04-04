import { Icon, useColorMode, VisuallyHidden } from "reflexjs"

export type ModeToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function ModeToggle({ ...props }: ModeToggleProps) {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <button
      onClick={() => setColorMode(colorMode === "default" ? "dark" : "default")}
      color="text"
      {...props}
    >
      <Icon name={colorMode === "default" ? "moon" : "sun"} size="5" />
      <VisuallyHidden>Toggle color mode</VisuallyHidden>
    </button>
  )
}
