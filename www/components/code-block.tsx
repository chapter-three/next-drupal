import classNames from "classnames"

import { Prism } from "components/prism"
import { CopyButton } from "components/copy-button"

export const preToCodeBlock = (preProps) => {
  const isMdxPre =
    preProps.children &&
    preProps.children.props &&
    preProps.children.props.mdxType === "code"

  const {
    children: codeString,
    className = "",
    language,
    ...props
  } = isMdxPre ? preProps.children.props : preProps

  const match = className.match(/language-([\0-\uFFFF]*)/)

  return {
    codeString: codeString.trim(),
    className: language ? `language-${language}` : className,
    language: language ? language : match != null ? match[1] : "",
    ...props,
  }
}

export function CodeBlock({ ...preProps }) {
  const props = preToCodeBlock(preProps)
  if (props) {
    const { codeString, title, className } = props

    return (
      <div className="relative flex flex-col h-full text-sm">
        <div
          className={classNames(
            "flex items-center justify-between px-6 text-gray-600 text-mono",
            { "pb-4": title }
          )}
        >
          {title && (
            <p className="flex items-center w-full ">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M13 2v7h7" />
              </svg>
              {title}
            </p>
          )}
          <CopyButton
            value={codeString}
            className={classNames(
              "absolute w-4 h-4 right-4 text-gray-50 z-10",
              title ? "top-14" : "top-4"
            )}
          />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-md">
          <Prism className={className}>{codeString}</Prism>
        </div>
      </div>
    )
  }
}
