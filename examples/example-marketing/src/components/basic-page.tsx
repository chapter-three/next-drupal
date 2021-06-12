interface BasicPageProps {
  page: Record<string, any>
}

export function BasicPage({ page }: BasicPageProps) {
  return (
    <div variant="container.sm" py="10|12">
      <h1 variant="heading.h1">{page.title}</h1>
      {page.body && (
        <div
          dangerouslySetInnerHTML={{ __html: page.body.processed }}
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
