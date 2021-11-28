import * as React from "react"
import copy from "copy-to-clipboard"

interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
  label?: string
  iconSize?: number
  children?: React.ReactNode
}

export function CopyButton({ value, children, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const handleClicked = () => {
    copy(value)
    setHasCopied(true)
  }

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <button onClick={handleClicked} {...props}>
      {children ? (
        children
      ) : hasCopied ? (
        <React.Fragment>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="sr-only">Copied</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span className="sr-only">Copy</span>
        </React.Fragment>
      )}
      <span className="sr-only">Copy</span>
    </button>
  )
}
