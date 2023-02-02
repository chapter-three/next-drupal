import Link from "next/link"
import { getMdxNode, getMdxPaths, getAllMdxNodes } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import classNames from "classnames"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"

import { Tutorial } from "types"
import { tutorialsConfig } from "config/tutorials"
import { Layout } from "components/layout"
import { Pager } from "components/pager"
import { mdxComponents } from "components/mdx"
import { Toc } from "components/toc"

export interface TutorialPageProps {
  tutorial: Tutorial
  group: {
    title: string
    items: Tutorial[]
  }
  tutorials: {
    title: string
    items: Tutorial[]
  }[]
  toc: TableOfContents
}

export default function TutorialPage({
  tutorial,
  group,
  tutorials,
  toc,
}: TutorialPageProps) {
  const content = useHydrate(tutorial, {
    components: mdxComponents,
  })

  const links = group.items.map((tutorial) => ({
    title: tutorial.frontMatter.title,
    href: tutorial.url,
  }))

  return (
    <Layout
      title={tutorial.frontMatter.title}
      description={tutorial.frontMatter.excerpt}
    >
      <div className="container px-6 mx-auto md:gap-10 xl:gap-8 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-[260px_1fr] lg:px-4 lg:grid xl:px-6">
        <aside className="sticky top-0 hidden max-h-screen col-span-2 pt-10 pb-64 pl-2 pr-4 overflow-y-auto border-r xl:col-span-1 lg:block">
          {tutorials.map((group, index) => (
            <div key={index} className="mb-12 -ml-2">
              <h4 className="px-2 py-1 mb-1 text-sm font-medium rounded-md">
                {group.title}
              </h4>
              <div className="grid grid-flow-row text-sm auto-rows-max">
                {group.items.map((wiz) => (
                  <Link key={wiz.hash} href={wiz.url} passHref>
                    <a
                      className={classNames(
                        "px-2 py-2 flex items-center w-full rounded-md hover:underline text-black",
                        tutorial.frontMatter.weight > wiz.frontMatter.weight &&
                          tutorial.frontMatter.group === wiz.frontMatter.group
                          ? "line-through opacity-50"
                          : "opacity-100",
                        {
                          "bg-blue-50": wiz.hash === tutorial.hash,
                        }
                      )}
                    >
                      {wiz.frontMatter.title}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="p-4 mt-5 border rounded-md border-blue-50 bg-blue-50 callout">
            <h4 className="mb-2 text-sm font-medium">Need help?</h4>
            <p className="text-sm text-gray-600">
              We are on{" "}
              <a
                href="https://twitter.com/shadcn"
                className="text-blue-800 hover:underline"
              >
                Twitter
              </a>
              ,{" "}
              <a
                href="https://github.com/chapter-three/next-drupal"
                className="text-blue-800 hover:underline"
              >
                GitHub
              </a>{" "}
              and{" "}
              <a
                href="https://drupal.slack.com/archives/C01E36BMU72"
                className="text-blue-800 hover:underline"
              >
                Slack
              </a>
              .
            </p>
          </div>
        </aside>
        <div className="items-start col-span-4 gap-12 pb-10 xl:col-span-1 xl:grid xl:grid-cols-3 xl:gap-18">
          <div className="col-span-2 pt-4 sm:pt-6 md:pt-10 DocSearch-content main-content">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {tutorial.frontMatter.title}
            </h1>
            {tutorial.frontMatter.excerpt ? (
              <p className="mt-2 text-lg font-light text-gray-700 md:text-xl">
                {tutorial.frontMatter.excerpt}
              </p>
            ) : null}
            <hr className="my-6" />
            {content}
            <Pager links={links} />
          </div>
          <aside className="sticky top-0 hidden pt-10 xl:block">
            {toc.items?.length && (
              <div className="p-4 border rounded-md">
                <h2 className="mb-1 text-sm font-medium rounded-md">
                  On this page
                </h2>
                <Toc tree={toc} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("tutorial"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const tutorial = await getMdxNode("tutorial", context, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
    },
  })

  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  const nodes = await getAllMdxNodes<Tutorial>("tutorial", context)

  const tutorials = tutorialsConfig.map((group) => {
    return {
      ...group,
      items: nodes.filter(
        (tutorial) => tutorial.frontMatter.group === group.title
      ),
    }
  })

  const group = tutorials.find(
    ({ title }) => title === tutorial.frontMatter.group
  )

  return {
    props: {
      tutorial,
      tutorials,
      group,
      toc: await getTableOfContents(tutorial),
    },
  }
}
