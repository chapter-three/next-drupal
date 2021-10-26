import { TableOfContents } from "next-mdx-toc"

interface TocProps {
  tree: TableOfContents
  level?: number
}

export function Toc({ tree, level = 1 }: TocProps) {
  return tree?.items?.length && level < 3 ? (
    <ul pl={level === 1 ? 0 : 3} fontSize="sm">
      {tree.items.map((item) => {
        return (
          <li key={item.title} mt="1">
            <a
              href={item.url}
              color="text"
              _hover={{
                color: "link",
              }}
            >
              {item.title}
            </a>
            {item.items?.length ? <Toc tree={item} level={level + 1} /> : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
