import Link from "next/link"
import Image from "next/image"
import { components } from "@reflexjs/mdx"
import { Tweet } from "mdx-embed"

import { Callout } from "components/callout"

const headingStyles = {
  display: "inline-flex",
  flexDirection: "row-reverse",
  alignItems: "center",
  justifyContent: "flex-end",
  scrollMarginTop: (theme) => theme.space[26],
  width: "100%",
  "&::before": {
    display: "block",
    height: "6rem",
    marginTop: "-6rem",
    visibility: "hidden",
    content: "''",
  },
  "> a": {
    display: "none",
    position: "relative",
    ml: 2,
    "&::before": {
      content: "'#'",
      fontSize: "inherit",
    },
  },
  _hover: {
    "> a": {
      display: "inline-block",
    },
  },
}

export const mdxComponents = {
  ...components,
  hr: (props) => <hr my="14" {...props} />,
  h2: (props) => (
    <h2
      variant="heading.h2"
      sx={headingStyles}
      borderTopWidth="1px"
      pt="4"
      mt="8"
      mb="4"
      {...props}
    />
  ),
  Callout,
  Tweet,
  Link,
  Img: ({ src, width, height, layout, alt, children, ...props }) => (
    <figure {...props}>
      <div borderWidth="1" p="2" borderRadius="lg">
        <Image
          src={src}
          width={width}
          height={height}
          layout={layout}
          alt={alt}
        />
      </div>
      <figcaption variant="text.caption">{children}</figcaption>
    </figure>
  ),
  Video: ({ src, ...props }) => (
    <div borderWidth="1" p="2" borderRadius="lg">
      <video controls muted {...props}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  ),
}
