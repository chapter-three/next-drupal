import * as React from "react"
import { VisuallyHidden } from "reflexjs"

const KEYBOARD_SHORTCUT_KEY = "/"

export function DocSearch({ ...props }) {
  const input = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (window.docsearch) {
      try {
        window.docsearch({
          apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
          indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
          inputSelector: "#docsearch-input",
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  React.useEffect(() => {
    const inputs = ["input", "select", "button", "textarea"]

    function handleKeyDown(event) {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1
      ) {
        if (event.key === KEYBOARD_SHORTCUT_KEY) {
          event.preventDefault()
          input.current.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div position="relative" {...props}>
      <VisuallyHidden>
        <label htmlFor="docsearch-input">Search</label>
      </VisuallyHidden>
      <input
        type="search"
        appearance="none"
        variant="input.sm"
        h="9"
        id="docsearch-input"
        placeholder="Type to search..."
        rounded="md"
        fontSize="sm"
        w="100%|275px"
        bg="muted"
        flex="1"
        ref={input}
      />
      <span
        position="absolute"
        top="1"
        right="1"
        bg="background"
        borderWidth="1"
        width="7"
        height="7"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        fontSize="sm"
      >
        {KEYBOARD_SHORTCUT_KEY}
      </span>
    </div>
  )
}
