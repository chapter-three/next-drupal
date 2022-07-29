export interface Page {
  id: string
  status: boolean
  type: "page"
  title: string
  body?: string
}

interface PageProps {
  page: Page
}

export function Page({ page, ...props }: PageProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{page.title}</h1>
      {page.body && (
        <div
          dangerouslySetInnerHTML={{ __html: page.body }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
