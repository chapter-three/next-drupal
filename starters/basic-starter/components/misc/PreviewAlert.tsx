import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export function PreviewAlert() {
  const router = useRouter()
  const isPreview = router.isPreview
  const [showPreviewAlert, setShowPreviewAlert] = useState<boolean>(false)

  useEffect(() => {
    setShowPreviewAlert(isPreview && window.top === window.self)
  }, [isPreview])

  if (!showPreviewAlert) {
    return null
  }

  return (
    <div className="sticky top-0 left-0 z-50 w-full px-2 py-1 text-center text-white bg-black">
      <p className="mb-0">
        This page is a preview.{" "}
        <button
          className="inline-block ml-3 rounded border px-1.5 hover:bg-white hover:text-black active:bg-gray-200 active:text-gray-500"
          onClick={() => router.push("/api/exit-preview")}
        >
          Exit preview mode
        </button>
      </p>
    </div>
  )
}
