import { Body } from "@/components/body"

export function NodeBasicPage({ node, ...props }) {
  return (
    <div variant="container.sm" py="10|12" {...props}>
      <h1 variant="heading.h1">{node.title}</h1>
      {node.body && <Body value={node.body.processed} />}
    </div>
  )
}
