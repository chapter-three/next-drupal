import { Suspense } from "react"
import { draftMode } from "next/headers"
import { DraftAlertClient } from "./Client"

export async function DraftAlert() {
  const draft = await draftMode()
  const isDraftEnabled = draft.isEnabled

  return (
    <Suspense fallback={null}>
      <DraftAlertClient isDraftEnabled={isDraftEnabled} />
    </Suspense>
  )
}
