import { DrupalMenuLinkContent } from "next-drupal"
import Link from "next/link"

interface FooterProps {
  copyright?: string
  links: DrupalMenuLinkContent[]
}

export function Footer({ copyright, links }: FooterProps) {
  return (
    <footer py="12|18|20">
      <div variant="container">
        <div
          borderTopWidth="1"
          display="flex"
          justifyContent="space-between"
          pt="6"
        >
          {copyright ? (
            <p fontSize="sm" color="gray">
              {copyright}
            </p>
          ) : null}
          {links?.length ? (
            <ul display="flex" alignItems="center">
              {links.map((link) => (
                <li key={link.id} ml="8">
                  <Link href={link.url} passHref>
                    <a color="text" textDecoration="none">
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
