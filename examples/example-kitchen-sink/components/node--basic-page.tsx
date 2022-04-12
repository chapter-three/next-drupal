export function NodeBasicPage({ node, ...props }) {
  return (
    <article {...props}>
      <h1 className="text-6xl font-black mb-4 leading-tight">{node.title}</h1>
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
