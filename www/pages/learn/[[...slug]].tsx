import Link from "next/link"
import { getMdxNode, getMdxPaths, getAllMdxNodes } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import { Icon } from "reflexjs"

import { Tutorial } from "types"
import { Layout } from "components/layout"
import { Pager } from "components/pager"
import { mdxComponents } from "components/mdx-components"
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
    url: tutorial.url,
  }))

  return (
    <Layout
      title={tutorial.frontMatter.title}
      description={tutorial.frontMatter.excerpt}
    >
      <div variant="container" mx="auto">
        <div display="grid" col="1|||280px minmax(0, 1fr)" gap="null|6|6|16">
          <div
            className="sidebar-nav"
            display="none|none|none|block"
            position="static|sticky"
            top="14"
            h={(theme) => `calc(100vh - ${theme.space[14]})`}
            overflow="scroll"
            py="6|12"
            pl="2"
            borderRightWidth="0|1px"
          >
            {Object.keys(groups).map((group, index) => (
              <div key={index}>
                <h4
                  fontSize="sm"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  pl="6"
                  mb="4"
                >
                  {group}
                </h4>
              </div>
            ))}
            <ul display="grid" row={`repeat(${tutorials.length}, 1fr)`} gap="2">
              {tutorials.map((wiz) => (
                <li
                  key={wiz.hash}
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                  textDecoration={
                    tutorial.frontMatter.weight > wiz.frontMatter.weight
                      ? "line-through"
                      : "none"
                  }
                  opacity={
                    tutorial.frontMatter.weight > wiz.frontMatter.weight
                      ? 0.5
                      : 1
                  }
                >
                  <div
                    mr="2"
                    width="4"
                    height="4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      name={wiz.hash === tutorial.hash ? "circle" : "check"}
                      width={wiz.hash === tutorial.hash ? 2 : 4}
                      height={wiz.hash === tutorial.hash ? 2 : 4}
                      visibility={
                        tutorial.frontMatter.weight >= wiz.frontMatter.weight
                          ? "visible"
                          : "hidden"
                      }
                    />
                  </div>
                  <Link href={wiz.url} passHref>
                    <a
                      fontWeight={
                        wiz.hash === tutorial.hash ? "bold" : "normal"
                      }
                      color={
                        wiz.hash === tutorial.hash ? "text" : "textLighter"
                      }
                    >
                      {wiz.frontMatter.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <div my="10" borderWidth="1px" borderRadius="md" p="4" mr="6">
              <h4>Need help?</h4>
              <p fontSize="sm">
                We are on <a href="https://twitter.com/shadcn">Twitter</a>,{" "}
                <a href="https://github.com/chapter-three/next-drupal">
                  GitHub
                </a>{" "}
                and{" "}
                <a href="https://drupal.slack.com/archives/C01E36BMU72">
                  Slack
                </a>
                .
              </p>
            </div>
            <Link href="/docs" passHref>
              <a variant="button.link" color="text">
                <Icon name="chevron-left" mr="2" />
                Read the docs
              </a>
            </Link>
          </div>
          <div>
            <div py="6|8|10" className="DocSearch-content">
              <div
                display="flex"
                flexDirection="column|column|row-reverse"
                justifyContent="space-between"
              >
                {tutorial.frontMatter.weight !== 0 ? (
                  <p color="textLighter" mt="4">
                    Step {tutorial.frontMatter.weight} of {tutorials.length - 1}
                  </p>
                ) : (
                  <span />
                )}
                <div>
                  <h1 variant="heading.h1" fontSize="5xl">
                    {tutorial.frontMatter.title}
                  </h1>
                  {tutorial.frontMatter.excerpt ? (
                    <p variant="text.lead" mt="2">
                      {tutorial.frontMatter.excerpt}
                    </p>
                  ) : null}
                </div>
              </div>
              <hr my="6" />
              {tutorial.frontMatter.video ? (
                <Video src={tutorial.frontMatter.video} heading="Play Video" />
              ) : null}
              <div maxWidth="700px">
                {content}
                <Pager links={links} />
              </div>
            </div>
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
