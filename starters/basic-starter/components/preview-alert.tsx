import * as React from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export function PreviewAlert() {
  const { isPreview } = useRouter()
  const [showPreviewAlert, setShowPreviewAlert] = React.useState<boolean>(false)

  React.useEffect(() => {
    setShowPreviewAlert(true)
  }, [isPreview])

  if (!showPreviewAlert) {
    return null
  }

  return (
    <div className="sticky top-0 left-0 z-50 w-full px-2 py-1 text-center text-white bg-black">
      <p className="mb-0">
        This page is a preview.{" "}
        <Link href="/api/exit-preview" passHref prefetch={false}>
          <a className="text-white underline">Click here</a>
        </Link>{" "}
        to exit preview mode.
      </p>
    </div>
  )
}
