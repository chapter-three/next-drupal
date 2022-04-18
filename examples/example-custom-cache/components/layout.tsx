import { DrupalBlock, DrupalMenuLinkContent } from "next-drupal"
import Link from "next/link"

export interface LayoutProps {
  menus: {
    main: DrupalMenuLinkContent[]
  }
  blocks: {
    copyright: DrupalBlock
  }
  children?: React.ReactNode
}

export function Layout({ menus, blocks, children }: LayoutProps) {
  return (
    <div>
      {menus?.main.length ? (
        <ul>
          {menus.main.map((item) => (
            <li key={item.id}>
              <Link href={item.url} passHref>
                <a>{item.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {children}
      {blocks?.copyright && (
        <div
          dangerouslySetInnerHTML={{ __html: blocks?.copyright.body.processed }}
        />
      )}
    </div>
  )
}
