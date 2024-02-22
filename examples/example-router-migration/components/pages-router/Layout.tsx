import { HeaderNav } from "@/components/navigation/HeaderNav"
import { PreviewAlert } from "@/components/pages-router/PreviewAlert"
import type { ReactNode } from "react"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <HeaderNav />
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  )
}
