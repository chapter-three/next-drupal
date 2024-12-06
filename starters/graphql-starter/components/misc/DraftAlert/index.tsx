import { Suspense } from "react"
import { draftMode } from "next/headers"
import { DraftAlertClient } from "./Client"

export async function DraftAlert() {
  const isDraftEnabled = (await draftMode()).isEnabled

  return (
    <Suspense fallback={null}>
      <DraftAlertClient isDraftEnabled={isDraftEnabled} />
    </Suspense>
  )
}
