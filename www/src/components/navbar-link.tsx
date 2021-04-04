import Link from "next/link"
import { useRouter } from "next/router"

export interface NavbarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  external?: boolean
  activePathNames?: string[]
  children: React.ReactNode
}

export function NavbarLink({
  href,
  external = false,
  activePathNames,
  children,
  ...props
}: NavbarLinkProps) {
  const { pathname } = useRouter()
  const isActive = pathname === href || activePathNames?.includes(pathname)
  return (
    <Link href={href} passHref>
      <a
        textDecoration="none"
        color={isActive ? "link" : "text"}
        fontSize="xl|md"
        px="6|6|6|0"
        py="2|2|2|0"
        fontWeight={isActive ? "semibold" : "normal"}
        _hover={{
          color: "primary",
          textDecoration: "underline",
        }}
        target={external ? "_blank" : "_self"}
        rel={external ? "noreferrer" : ""}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}
