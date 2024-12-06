import { Suspense } from "react"
import { draftMode } from "next/headers"
import { DraftAlertClient } from "./Client"

export async function DraftAlert() {
  const draftModeStore = await draftMode()
  const isDraftEnabled = draftModeStore.isEnabled

  return (
    <Suspense fallback={null}>
      <DraftAlertClient isDraftEnabled={isDraftEnabled} />
    </Suspense>
  )
}
