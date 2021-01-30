import { Navbar } from "@/components/navbar"
import { site } from "@/config"

interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer py="12|18|20">
        <div variant="container.sm">
          <div borderTopWidth="1" display="flex" justifyContent="center" pt="6">
            {site.copyright ? (
              <p fontSize="sm" color="gray">
                {site.copyright}
              </p>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
