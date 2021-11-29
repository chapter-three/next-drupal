import * as React from "react"
import { GetStaticPropsResult } from "next"
import { getAllMdxNodes } from "next-mdx"
import Link from "next/link"

import { site } from "config/site"
import { Feature } from "types"
import { Layout } from "components/layout"
import classNames from "classnames"
import { useHydrate } from "next-mdx/client"
import { mdxComponents } from "components/mdx"

interface FeatureBoxProps {
  feature: Feature
}

export function FeatureBox({ feature, ...props }: FeatureBoxProps) {
  const content = useHydrate(feature, {
    components: mdxComponents,
  })

  return (
    <div className="lg:hidden">
      <button
        className={classNames(
          "p-4 bg-white rounded-md text-left transition-all group w-full shadow-lg"
        )}
        {...props}
      >
        <h4 className="font-bold transition-all group-hover:text-blue-700">
          {feature.frontMatter.title}
        </h4>
        <p className="text-sm text-gray-700">{feature.frontMatter.excerpt}</p>
      </button>
      <div className="mt-6 ">{content}</div>
    </div>
  )
}

interface IndexPageProps {
  features: Feature[]
}

export default function IndexPage({ features }: IndexPageProps) {
  const [selectedFeature, setSelectedFeature] = React.useState<Feature>(
    features[0]
  )
  const content = useHydrate(selectedFeature, {
    components: mdxComponents,
  })

  return (
    <Layout title={site.name} description={site.description}>
      <section className="px-6 py-6 md:py-12 lg:py-20">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight text-center md:text-6xl lg:tracking-tighter lg:text-8xl">
            The future of Drupal is headless
          </h1>
          <p className="mx-auto mt-4 text-lg text-center text-gray-500 leading-1 md:px-10 lg:leading-normal lg:text-2xl">
            Next.js for Drupal has everything you need to build a
            high-performant and fast front-end for your Drupal site.
          </p>
          <div className="flex flex-col items-center justify-center py-4 sm:flex-row md:py-8 lg:py-10">
            <Link href="/learn/quick-start" passHref>
              <a className="w-2/3 px-8 py-2 font-semibold text-center text-white transition-all bg-blue-800 border-2 border-blue-800 rounded-md sm:w-auto hover:bg-white hover:text-black">
                Get Started
              </a>
            </Link>
            <Link href="/docs" passHref>
              <a className="w-2/3 px-8 py-2 mt-4 font-semibold text-center text-black transition-all bg-white border-2 border-black rounded-md sm:w-auto sm:mt-0 sm:ml-4 hover:bg-gray-100 hover:text-black">
                Read the docs
              </a>
            </Link>
          </div>
        </div>
      </section>
      <section className="px-6 py-6 md:py-12 lg:py-20">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center md:text-5xl lg:tracking-tighter lg:text-6xl">
            Everything you expect from Drupal.
            <br />
            On a modern stack.
          </h2>
          <p className="mx-auto mt-4 text-lg text-center text-gray-500 leading-1 md:px-10 lg:leading-normal lg:text-2xl">
            Going headless does not mean you have to compromise on features.
          </p>
          <div className="grid gap-6 pt-6 text-left sm:grid-cols-2 lg:pt-10 lg:grid-cols-3">
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Seamless Editing</h4>
              <p className="text-sm leading-normal text-gray-600">
                Inline preview built-in. With support for content revision.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Instant Publishing</h4>
              <p className="text-sm leading-normal text-gray-600">
                New content and updates are live instantly.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Multi-site</h4>
              <p className="text-sm leading-normal text-gray-600">
                Power multiple Next.js sites from one Drupal site.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Authentication</h4>
              <p className="text-sm leading-normal text-gray-600">
                Authentication with support for roles and permissions.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Webforms</h4>
              <p className="text-sm leading-normal text-gray-600">
                Built React forms backed by the Webform module.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h4 className="mb-2 font-bold">Search API</h4>
              <p className="text-sm leading-normal text-gray-600">
                Support for decoupled faceted search.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="px-6 py-6 md:py-12 lg:py-20">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center md:text-5xl lg:tracking-tighter lg:text-6xl">
            Out-of-the-box tooling for the best developer experience
          </h2>
          <p className="mx-auto mt-4 text-lg text-center text-gray-500 leading-1 md:px-10 lg:leading-normal lg:text-2xl">
            Build all the features you need. Faster.
          </p>
        </div>
        <div className="container max-w-5xl grid-cols-2 gap-6 mx-auto mt-10 lg:grid">
          <div className="grid-flow-row gap-4 mt-10 lg:max-w-md lg:grid auto-rows-max">
            {features.map((feature) => (
              <div key={feature.hash}>
                <FeatureBox feature={feature} />
                <button
                  className={classNames(
                    "p-4 bg-white rounded-md w-full text-left hidden lg:block transition-all group",
                    {
                      "shadow-lg text-blue-700":
                        selectedFeature.hash === feature.hash,
                    }
                  )}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <h4 className="font-bold transition-all group-hover:text-blue-700">
                    {feature.frontMatter.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {feature.frontMatter.excerpt}
                  </p>
                </button>
              </div>
            ))}
          </div>
          <div className="flex-col hidden lg:flex">{content}</div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  const features = await getAllMdxNodes<Feature>("feature")

  return {
    props: {
      features,
    },
  }
}
