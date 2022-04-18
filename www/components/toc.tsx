import classNames from "classnames"
import { TableOfContents } from "next-mdx-toc"

interface TocProps {
  tree: TableOfContents
  level?: number
}

export function Toc({ tree, level = 1 }: TocProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={classNames("text-sm", { "pl-2": level !== 1 })}>
      {tree.items.map((item) => {
        return (
          <li
            key={item.title}
            className={classNames("pt-2", {
              "pt-2": level === 1,
            })}
          >
            <a
              href={item.url}
              className={classNames("text-gray-700 hover:text-black", {
                "text-sm": level !== 1,
              })}
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
