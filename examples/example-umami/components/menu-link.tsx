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
    <NextLink href={href} passHref>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </NextLink>
  )
}

export const MenuLink = React.forwardRef<HTMLAnchorElement, MenuLinkProps>(
  CustomLink
)
