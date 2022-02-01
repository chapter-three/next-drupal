import * as React from "react"
import NextLink from "next/link"
import type { LinkProps as NextLinkProps } from "next/link"
import { useRouter } from "next/router"

import { isRelative } from "lib/utils/is-relative"

interface LinkProps extends NextLinkProps {
  href: string
  children?: React.ReactElement
}

export function Link({ href, passHref, as, children, ...props }: LinkProps) {
  const router = useRouter()

  if (!href) {
    return null
  }

  // Use Next Link for internal links, and <a> for others.
  if (isRelative(href)) {
    // Disable prefetching in preview mode.
    // We do this here inside of inline `prefetch={!router.isPreview}`
    // because `prefetch={true}` is not allowed.
    // See https://nextjs.org/docs/messages/prefetch-true-deprecated
    const linkProps = router.isPreview ? { prefetch: false, ...props } : props

    return (
      <NextLink as={as} href={href} passHref={passHref} {...linkProps}>
        {children}
      </NextLink>
    )
  }

  return React.cloneElement(children, {
    href,
  })
}
