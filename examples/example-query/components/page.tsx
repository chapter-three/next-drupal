import Head from "next/head"
import { Page } from "types"

interface PageProps {
  page: Page
}

export function Page({ page, ...props }: PageProps) {
  return (
    <>
      <Head>
        <title key="head_title">{page.title}</title>
      </Head>
      <article {...props}>
        <h1 className="mb-4 text-6xl font-black leading-tight">{page.title}</h1>
        {page.content && (
          <div
            dangerouslySetInnerHTML={{ __html: page.content }}
            className="mt-6 font-serif text-xl leading-loose prose"
          />
        )}
      </article>
    </>
  )
}
