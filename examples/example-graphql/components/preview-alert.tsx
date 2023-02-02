import * as React from "react"
import { useRouter } from "next/router"

export function PreviewAlert() {
  const { isPreview } = useRouter()
  const [showPreviewAlert, setShowPreviewAlert] = React.useState<boolean>(false)

  React.useEffect(() => {
    setShowPreviewAlert(isPreview && window.top === window.self)
  }, [isPreview])

  if (!showPreviewAlert) {
    return null
  }

  return (
    <div className="sticky top-0 left-0 z-50 w-full px-2 py-1 text-center text-white bg-black">
      <p className="mb-0">
        This page is a preview.{" "}
        {/* eslint-disable @next/next/no-html-link-for-pages */}
        <a href="/api/exit-preview" className="text-white underline">
          Click here
        </a>{" "}
        to exit preview mode.
      </p>
    </div>
  )
}
