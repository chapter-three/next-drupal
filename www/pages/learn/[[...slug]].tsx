import Link from "next/link"
import { getMdxNode, getMdxPaths, getAllMdxNodes } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import classNames from "classnames"

import { Tutorial } from "types"
import { Layout } from "components/layout"
import { Pager } from "components/pager"
import { mdxComponents } from "components/mdx"
import { Video } from "components/video"

export interface TutorialPageProps {
  tutorial: Tutorial
  tutorials: Tutorial[]
  groups: {
    [group: string]: Tutorial[]
  }
}

export default function TutorialPage({
  tutorial,
  tutorials,
  groups,
}: TutorialPageProps) {
  const content = useHydrate(tutorial, {
    components: mdxComponents,
  })

  const links = tutorials.map((tutorial) => ({
    title: tutorial.frontMatter.title,
    href: tutorial.url,
  }))

  return (
    <Layout
      title={tutorial.frontMatter.title}
      description={tutorial.frontMatter.excerpt}
    >
      <div className="container px-6 mx-auto md:gap-10 xl:gap-10 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-4 lg:grid xl:px-4">
        <aside className="hidden col-span-2 py-10 pr-4 border-r xl:col-span-1 lg:block">
          {Object.keys(groups).map((group, index) => (
            <div key={index}>
              <h4 className="pl-6 mb-2 text-sm font-medium">{group}</h4>
            </div>
          ))}
          <ul className="grid grid-flow-row gap-2 auto-rows-max">
            {tutorials.map((wiz) => (
              <li
                key={wiz.hash}
                className={classNames(
                  "flex items-center",
                  tutorial.frontMatter.weight > wiz.frontMatter.weight
                    ? "line-through opacity-50"
                    : "opacity-100"
                )}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-2">
                  {wiz.hash === tutorial.hash ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2 h-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={classNames(
                        "w-4 h-4",
                        tutorial.frontMatter.weight >= wiz.frontMatter.weight
                          ? "visible"
                          : "invisible"
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <Link href={wiz.url} passHref>
                  <a
                    className={classNames(
                      "text-sm hover:text-black",
                      wiz.hash === tutorial.hash
                        ? "text-black font-semibold"
                        : "text-gray-700"
                    )}
                  >
                    {wiz.frontMatter.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-4 my-6 mt-10 mr-4 border rounded-md border-blue-50 bg-blue-50 callout">
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
        <div className="col-span-4 pt-4 pb-10 xl:col-span-3 sm:pt-6 md:pt-10 DocSearch-content">
          <div>
            {tutorial.frontMatter.weight !== 0 ? (
              <p className="text-sm text-gray-600">
                Step {tutorial.frontMatter.weight} of {tutorials.length - 1}
              </p>
            ) : (
              <span />
            )}
            <div>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {tutorial.frontMatter.title}
              </h1>
              {tutorial.frontMatter.excerpt ? (
                <p className="text-lg font-light text-gray-700 md:mt-2 md:text-2xl">
                  {tutorial.frontMatter.excerpt}
                </p>
              ) : null}
            </div>
          </div>
          <hr className="my-6" />
          {tutorial.frontMatter.video ? (
            <Video src={tutorial.frontMatter.video} heading="Play Video" />
          ) : null}
          <div className="max-w-xl">
            {content}
            <Pager links={links} />
          </div>
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

  const tutorials = await getAllMdxNodes<Tutorial>("tutorial", context)
  const groups = {}
  for (const tutorial of tutorials) {
    if (!Array.isArray(groups[tutorial.frontMatter.group])) {
      groups[tutorial.frontMatter.group] = []
    }
    groups[tutorial.frontMatter.group].push(tutorial)
  }

  return {
    props: {
      tutorial,
      tutorials,
      groups,
    },
  }
}
