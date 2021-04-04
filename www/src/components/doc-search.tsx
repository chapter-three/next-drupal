import * as React from "react"
import { VisuallyHidden } from "reflexjs"

export function DocSearch({ ...props }) {
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

  return (
    <div {...props}>
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
      />
    </div>
  )
}
