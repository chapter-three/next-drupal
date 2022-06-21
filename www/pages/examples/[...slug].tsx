import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"

import { Example } from "types"
import { Layout } from "components/layout"
import { mdxComponents } from "components/mdx"
import Link from "next/link"

export interface ExamplesPageProps {
  example: Example
}

export default function ExamplesPage({ example }: ExamplesPageProps) {
  const content = useHydrate(example, {
    components: mdxComponents,
  })

  return (
    <Layout
      title={example.frontMatter.title}
      description={example.frontMatter.excerpt}
    >
      <div className="container px-6 mx-auto md:gap-10 xl:gap-8 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-[260px_1fr] lg:px-4 lg:grid xl:px-6">
        <div className="items-start col-span-4 col-start-2 gap-12 pb-10 xl:grid xl:grid-cols-3 xl:gap-18">
          <div className="col-span-2 pt-4 sm:pt-6 md:pt-10 main-content">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {example.frontMatter.title}
            </h1>
            {example.frontMatter.excerpt ? (
              <p className="mt-2 text-lg font-light text-gray-700 md:text-xl">
                {example.frontMatter.excerpt}
              </p>
            ) : null}
            <hr className="my-6" />
            {content}
            <hr className="my-12" />
            <div className="flex">
              <Link href="/examples" passHref>
                <a className="flex items-center px-4 py-3 leading-none text-gray-600 border rounded-md hover:text-black">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  See all examples
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("example"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const example = await getMdxNode("example", context, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
    },
  })

  if (!example) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      example,
    },
  }
}
