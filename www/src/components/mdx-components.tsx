import Link from "next/link"
import Image from "next/image"
import { components } from "@reflexjs/mdx"

import { Callout } from "@/components/callout"

export const mdxComponents = {
  ...components,
  Callout,
  Link,
  Img: ({ src, width, height, layout, children, ...props }) => (
    <figure {...props}>
      <div borderWidth="1" p="2" borderRadius="lg">
        <Image src={src} width={width} height={height} layout={layout} />
      </div>
      <figcaption variant="text.caption">{children}</figcaption>
    </figure>
  ),
}
