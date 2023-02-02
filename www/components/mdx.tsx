import Link from "next/link"
import Image from "next/image"

import { Callout } from "components/callout"
import { Video } from "components/video"
import { CodeBlock } from "components/code-block"
import { Card, CardHeading, CardBody } from "components/card"

export const mdxComponents = {
  p: (props) => <p className="mb-6 leading-relaxed text-black" {...props} />,
  hr: (props) => <hr className="my-6" {...props} />,
  h1: (props) => (
    <h1
      className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2 className="mt-12 mb-6 text-2xl font-semibold md:text-3xl" {...props} />
  ),
  h3: (props) => <h3 className="my-6 text-2xl font-semibold" {...props} />,
  h4: (props) => <h3 className="my-6 text-xl font-semibold" {...props} />,
  h5: (props) => <h3 className="my-6 text-lg font-semibold" {...props} />,
  h6: (props) => (
    <h3 className="my-6 font-semibold uppercase text-md" {...props} />
  ),
  ul: (props) => <ul className="pl-8 mb-8 list-disc list-outside" {...props} />,
  ol: (props) => (
    <ol className="pl-8 mb-8 list-decimal list-outside" {...props} />
  ),
  li: (props) => <li className="mb-2 leading-relaxed break-words" {...props} />,
  a: (props) => <a className="text-blue-700 hover:underline" {...props} />,
  figure: (props) => <figure className="my-6" {...props} />,
  figcaption: (props) => <figcaption className="text-center" {...props} />,
  inlineCode: ({ children, ...props }) => (
    <code
      className="font-mono text-sm font-medium text-gray-800 px-[0.2rem] py-[0.1rem] break-words bg-gray-300 bg-opacity-25 border rounded"
      {...props}
    >
      {children}
    </code>
  ),
  pre: (props) => {
    if (props["data-theme"]) {
      return (
        <pre
          className="mt-6 mb-4 overflow-x-auto rounded-lg bg-slate-900 py-4"
          {...props}
        />
      )
    }
    return <div className="flex-1 my-10" {...props} />
  },
  table: (props) => (
    <div className="table-container">
      <table {...props} />
    </div>
  ),
  td: ({ align, ...props }) => {
    return <td align={align} {...props} />
  },
  th: ({ align, ...props }) => {
    return <th align={align} {...props} />
  },
  code: ({ ...props }) => {
    // This is using Prism remark.
    if (props.children && props.className) {
      return <CodeBlock {...props} />
    }

    return (
      <code
        className="relative rounded border bg-slate-300 bg-opacity-25 py-[0.2rem] px-[0.3rem] font-mono text-sm text-slate-600"
        {...props}
      />
    )
  },
  Callout,
  Link,
  Img: ({ src, width, height, layout, alt, children, ...props }) => (
    <figure className="my-6" {...props}>
      <div className="overflow-hidden border rounded-md">
        <Image
          src={src}
          width={width}
          height={height}
          layout={layout}
          alt={alt}
        />
      </div>
      <figcaption className="py-4 text-sm text-center text-gray-500">
        {children}
      </figcaption>
    </figure>
  ),
  Video,
  Card,
  CardHeading,
  CardBody,
}
