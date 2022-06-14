import { getAllMdxNodes } from "next-mdx/server"
import Link from "next/link"

import { Guide } from "types"
import { guidesConfig } from "config/guides"
import { Layout } from "components/layout"

export interface GuidesPageProps {
  guides: Guide[]
}

export default function GuidesPage({ guides }: GuidesPageProps) {
  return (
    <Layout
      title="Guides"
      description="Helpful guides for developing headless sites with Next.js and Drupal."
    >
      <div className="container max-w-4xl px-6 py-12 mx-auto xl:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Guides
        </h1>
        <p className="mt-4 text-gray-700">
          Helpful guides for developing headless sites with Next.js and Drupal.
        </p>
        <hr className="py-6 mt-6" />
        <div className="grid gap-10 sm:grid-cols-2">
          {guides.map((guide) => (
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
                  <p className="my-4 text-gray-700">
                    {guide.frontMatter.excerpt}
                  </p>
                ) : null}
              </div>
              <Link href={guide.url} passHref>
                <a className="text-sm text-blue-500 transition-colors">
                  <span className="absolute inset-0" />
                  Read More →
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
  const guides = await getAllMdxNodes<Guide>("guide", context)

  const titles = guidesConfig.links[0].items.map((link) => link.title)

  return {
    props: {
      guides: guides.sort(
        (a, b) =>
          titles.indexOf(a.frontMatter.title) -
          titles.indexOf(b.frontMatter.title)
      ),
    },
  }
}
