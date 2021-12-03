import * as React from "react"

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
    <div
      className="relative flex-1 md:min-w-[300px] lg:min-w-[400px]"
      {...props}
    >
      <label htmlFor="docsearch-input" className="sr-only">
        Search
      </label>
      <input
        type="search"
        id="docsearch-input"
        placeholder="Search the docs..."
        ref={input}
        className="w-full text-sm border-0 border-gray-200 rounded-md h-9 bg-gray-50"
      />
      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-gray-600 bg-gray-200 rounded-md top-2 right-2">
        {KEYBOARD_SHORTCUT_KEY}
      </span>
    </div>
  )
}
