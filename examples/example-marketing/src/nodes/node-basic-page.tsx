export function NodeBasicPage({ node, ...props }) {
  return (
    <div variant="container.sm" py="10|12" {...props}>
      <h1 variant="heading.h1">{node.title}</h1>
      {node.body && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body.processed }}
          sx={{
            p: {
              variant: "text",
              fontSize: "xl",
              my: 8,
              lineHeight: 8,
            },
          }}
        />
      )}
    </div>
  )
}
