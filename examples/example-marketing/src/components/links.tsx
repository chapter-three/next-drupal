import Link from "next/link"

export interface LinksProps {
  links: {
    title: string
    uri: string
    options?: []
  }[]
}

export function Links({ links }: LinksProps) {
  if (!links.length) return null

  return (
    <div display="inline-grid" col={links.length} gap="2" mt="4">
      {links.map((link, index) => (
        <Link href={link.uri} key={index} passHref>
          <a variant={`button.${index === 0 ? "primary" : "secondary"}.lg`}>
            {link.title}
          </a>
        </Link>
      ))}
    </div>
  )
}
