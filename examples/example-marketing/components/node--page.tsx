import { FormattedText } from "components/formatted-text"
import { NodeProps } from "components/node"

export function NodePage({ node, ...props }: NodeProps) {
  delete props.viewMode

  return (
    <div className="container max-w-3xl px-6 pt-10 mx-auto md:pt-20" {...props}>
      <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-5xl">
        {node.title}
      </h1>
      <div className="prose">
        {node.body && <FormattedText processed={node.body.processed} />}
      </div>
    </div>
  )
}
