import { getAllMdxNodes } from "next-mdx/server"
import Link from "next/link"

import { Example } from "types"
import { Layout } from "components/layout"

export interface ExamplesPageProps {
  examples: Example[]
}

export default function ExamplesPage({ examples }: ExamplesPageProps) {
  return (
    <Layout
      title="Examples"
      description="Code examples for working with Next.js and Drupal JSON:API."
    >
      <div className="container max-w-6xl px-6 py-12 mx-auto xl:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Examples
        </h1>
        <p className="mt-2 text-lg font-light text-gray-700 md:text-xl">
          Code examples for working with Next.js and Drupal JSON:API.
        </p>
        <hr className="py-6 mt-6" />
        <div className="grid gap-10 sm:grid-cols-3">
          {examples.map((guide) => (
            <article
              key={guide.slug}
              className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow-md group"
            >
              <div>
                <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary">
                  <Link href={guide.url} passHref>
                    <a>{guide.frontMatter.title}</a>
                  </Link>
                </h2>
                {guide.frontMatter.excerpt ? (
                  <p className="mt-2 text-gray-700">
                    {guide.frontMatter.excerpt}
                  </p>
                ) : null}
              </div>
              <Link href={guide.url} passHref>
                <a className="text-sm text-blue-500 transition-colors">
                  <span className="absolute inset-0" />
                  <span className="sr-only">Read More →</span>
                </a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      examples: await getAllMdxNodes<Example>("example", context),
    },
  }
}
