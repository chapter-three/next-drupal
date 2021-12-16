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

interface FeatureCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  feature: Feature
}

export function FeatureCode({ feature, ...props }: FeatureCodeProps) {
  const content = useHydrate(feature, {
    components: mdxComponents,
  })

  return <div {...props}>{content}</div>
}

interface IndexPageProps {
  features: Feature[]
}

export default function IndexPage({ features }: IndexPageProps) {
  const [selectedFeature, setSelectedFeature] = React.useState<Feature>(
    features[0]
  )

  return (
    <Layout title={site.name} description={site.description} mode="dark">
      <section className="relative px-6 pt-12 pb-8 text-white bg-black md:py-12 md:pb-8 lg:pt-32 lg:pb-28">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight text-center md:text-6xl lg:tracking-tighter lg:text-8xl">
            The future of Drupal is headless
          </h1>
          <p className="mx-auto mt-4 text-lg text-center text-gray-200 leading-1 md:px-20 lg:leading-normal lg:text-2xl">
            Next.js for Drupal has everything you need to build a
            next-generation front-end for your Drupal site.
          </p>
          <div className="flex flex-col items-center justify-center py-4 sm:flex-row md:py-8 lg:py-10">
            <Link href="/learn/quick-start" passHref>
              <a className="w-2/3 px-8 py-2 font-semibold text-center text-white transition-all bg-purple-700 border-2 border-purple-700 rounded-md sm:w-auto hover:bg-purple-800 hover:border-purple-800">
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
      <div className="hidden w-full lg:block h-14 md:h-20 divider" />
      <section className="px-6 py-6 md:py-12 lg:py-20">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center md:text-5xl lg:tracking-tighter lg:text-6xl">
            Everything you expect from Drupal.
            <br />
            On a modern stack.
            <br />
          </h2>
          <p className="mx-auto mt-4 text-lg text-center text-gray-700 leading-1 md:px-16 lg:leading-normal lg:text-2xl">
            Go headless without compromising features.
          </p>
          <div className="grid gap-6 pt-6 text-left sm:grid-cols-2 lg:pt-10 lg:grid-cols-3">
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Seamless Editing</h3>
              <p className="text-sm leading-normal text-gray-600">
                Inline preview built-in to the editing interface.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Instant Publishing</h3>
              <p className="text-sm leading-normal text-gray-600">
                New content and updates are live instantly.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Multi-site</h3>
              <p className="text-sm leading-normal text-gray-600">
                Power multiple Next.js sites from one Drupal site.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Authentication</h3>
              <p className="text-sm leading-normal text-gray-600">
                Authentication with support for roles and permissions.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Webforms</h3>
              <p className="text-sm leading-normal text-gray-600">
                Built React forms backed by the Webform module.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Search API</h3>
              <p className="text-sm leading-normal text-gray-600">
                Support for decoupled faceted search powered by Search API.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Internationalization</h3>
              <p className="text-sm leading-normal text-gray-600">
                Built-in translation and Automatic Language detection.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Performance</h3>
              <p className="text-sm leading-normal text-gray-600">
                Deploy and scale your sites via content delivery networks.
              </p>
            </div>
            <div className="p-6 bg-white border rounded-md">
              <h3 className="mb-2 font-bold">Security</h3>
              <p className="text-sm leading-normal text-gray-600">
                Protect your site from attacks by separating code from the
                interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="py-6 md:px-6 md:py-12 lg:py-20">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center md:text-5xl lg:tracking-tighter lg:text-6xl">
            Out-of-the-box tooling for the best developer experience
          </h2>
          <p className="mx-auto mt-4 text-lg text-center text-gray-700 leading-1 md:px-16 lg:leading-normal lg:text-2xl">
            Build all the features you need. Faster.
          </p>
        </div>
        <div className="container max-w-5xl grid-cols-2 gap-6 mx-auto mt-10 md:grid">
          <div className="grid grid-flow-row gap-4 mt-10 md:max-w-md auto-rows-max">
            {features.map((feature) => (
              <div
                className="overflow-hidden md:overflow-visible"
                key={feature.hash}
              >
                <button
                  className={classNames(
                    "px-6 md:px-4 py-4 bg-white rounded-md w-full text-left block transition-all group",
                    {
                      "md:shadow-lg text-purple-700":
                        selectedFeature.hash === feature.hash,
                    }
                  )}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <h3 className="font-bold transition-all group-hover:text-purple-700">
                    {feature.frontMatter.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {feature.frontMatter.excerpt}
                  </p>
                </button>
                <FeatureCode feature={feature} className="md:hidden" />
              </div>
            ))}
          </div>
          <FeatureCode
            className="flex-col hidden md:flex"
            feature={selectedFeature}
          />
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
