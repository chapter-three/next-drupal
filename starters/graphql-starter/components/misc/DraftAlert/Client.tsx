"use client"

import { useEffect, useState } from "react"

export function DraftAlertClient({
  isDraftEnabled,
}: {
  isDraftEnabled: boolean
}) {
  const [showDraftAlert, setShowDraftAlert] = useState<boolean>(false)

  useEffect(() => {
    setShowDraftAlert(isDraftEnabled && window.top === window.self)
  }, [isDraftEnabled])

  if (!showDraftAlert) {
    return null
  }

  function buttonHandler() {
    void fetch("/api/disable-draft")
    setShowDraftAlert(false)
  }

  return (
    <div className="sticky top-0 left-0 z-50 w-full px-2 py-1 text-center text-white bg-black">
      <p className="mb-0">
        This page is a draft.
        <button
          className="inline-block ml-3 rounded border px-1.5 hover:bg-white hover:text-black active:bg-gray-200 active:text-gray-500"
          onClick={buttonHandler}
        >
          Exit draft mode
        </button>
      </p>
    </div>
  )
}
