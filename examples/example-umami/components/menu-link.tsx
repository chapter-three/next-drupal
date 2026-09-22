import * as React from "react"
import NextLink, { LinkProps as NextLinkProps } from "next/link"

export type MenuLinkProps = Omit<
  NextLinkProps,
  "as" | "passHref" | "children"
> &
  React.HTMLAttributes<HTMLAnchorElement>

function CustomLink(props, ref) {
  let { href, children, ...rest } = props
  return (
    <NextLink href={href} passHref ref={ref} {...rest}>
      {children}
    </NextLink>
  )
}

export const MenuLink = React.forwardRef<HTMLAnchorElement, MenuLinkProps>(
  CustomLink
)
