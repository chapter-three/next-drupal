import { Suspense } from "react"
import { draftMode } from "next/headers"
import { DraftAlertClient } from "./Client"

export function DraftAlert() {
  const isDraftEnabled = draftMode().isEnabled

  return (
    <Suspense fallback={null}>
      <DraftAlertClient isDraftEnabled={isDraftEnabled} />
    </Suspense>
  )
}
