import Link from "next/link"

import { Tutorial } from "types"
import { Layout } from "components/layout"
import { tutorialsConfig } from "config/tutorials"

export interface LearnPageProps {
  tutorials: Tutorial[]
}

export default function LearnPage({ tutorials }: LearnPageProps) {
  return (
    <Layout
      title="Learn"
      description="Get started with Next.js for Drupal, implement Preview Mode and add
      On-demand Revalidation."
    >
      <div className="container max-w-4xl px-6 py-12 mx-auto xl:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Learn
        </h1>
        <p className="mt-4 text-gray-700">
          Get started with Next.js for Drupal, implement Preview Mode and add
          On-demand Revalidation.
        </p>
        <hr className="py-6 mt-6" />
        <div className="grid gap-10 sm:grid-cols-2">
          {tutorialsConfig.map((tutorial) => (
            <article
              key={tutorial.url}
              className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow-md group"
            >
              <div>
                <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary">
                  <a>{tutorial.title}</a>
                </h2>
                {tutorial.excerpt ? (
                  <p className="my-4 text-gray-700">{tutorial.excerpt}</p>
                ) : null}
              </div>
              <Link href={tutorial.url} passHref>
                <a className="text-sm text-blue-500 transition-colors">
                  <span className="absolute inset-0" />
                  Learn More →
                </a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}
