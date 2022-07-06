import { DrupalNode } from "next-drupal"

interface NodeBasicPageProps {
  node: DrupalNode
}

export function NodeBasicPage({ node, ...props }: NodeBasicPageProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
