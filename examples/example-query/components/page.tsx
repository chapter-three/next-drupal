import Head from "next/head"

import { NodePage } from "queries/node--page"

interface PageProps {
  page: NodePage
}

export function Page({ page, ...props }: PageProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <article {...props}>
        <h1 className="mb-4 text-6xl font-black leading-tight">{page.title}</h1>
        {page.body && (
          <div
            dangerouslySetInnerHTML={{ __html: page.body }}
            className="mt-6 font-serif text-xl leading-loose prose"
          />
        )}
      </article>
    </>
  )
}
