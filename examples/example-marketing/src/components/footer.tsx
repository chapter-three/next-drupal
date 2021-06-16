import { DrupalMenuLinkContent } from "next-drupal"
import Link from "next/link"

interface FooterProps {
  copyright?: string
  links: DrupalMenuLinkContent[]
}

export function Footer({ copyright, links }: FooterProps) {
  return (
    <footer height="100px" flexShrink="0">
      <div variant="container">
        <div
          borderTopWidth="1"
          display="flex"
          flexDirection="column-reverse|row"
          justifyContent="center|space-between"
          alignItems="center"
          pt="6"
        >
          {copyright ? (
            <p fontSize="sm" color="gray">
              {copyright}
            </p>
          ) : null}
          {links?.length ? (
            <ul
              display="inline-grid"
              col={`repeat(${links.length}, auto)`}
              justifyContent="center"
              gap="4"
              alignItems="center"
              mb="4|0"
            >
              {links.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} passHref>
                    <a color="text" textDecoration="none" fontSize="sm">
                      {link.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
