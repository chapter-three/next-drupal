import * as React from "react"
import { GetStaticPropsResult } from "next"
import Head from "next/head"
import Link from "next/link"
import withCustomStyles from "../components/withCustomStyles"
import {
  resolveWebformContent,
  Webform,
  components,
  WebformProps,
} from "nextjs-drupal-webform"
import { drupal } from "basic-starter/lib/drupal"
import classNames from "classnames"
import WebformButton from "../components/WebformButton"

interface WebformPageProps {
  webform: WebformProps
}

export default function WebformPage({ webform }: WebformPageProps) {
  const labelProps = {
    className: classNames(["block", "text-sm", "font-medium", "text-gray-700"]),
  }
  const fieldProps = {
    className: classNames([
      "relative",
      "block",
      "w-full px-3",
      "py-2 mt-1 text-gray-900",
      "placeholder-gray-500",
      "border border-gray-300",
      "rounded-md appearance-none",
      "focus:outline-none",
      "focus:ring-black",
      "focus:border-black",
      "focus:z-10",
      "sm:text-sm",
    ]),
  }
  const wrapperProps = {
    className: classNames(["space-y-3"]),
  }
  const buttonProps = {
    className: classNames([
      "px-4",
      "py-2",
      "text-sm font-medium",
      "text-white",
      "bg-black",
      "border border-transparent",
      "rounded-md",
      "shadow-sm",
      "hover:bg-black",
    ]),
    "data-cy": "btn-submit",
  }

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Webform Example</title>
      </Head>
      <div className="container max-w-2xl px-6 py-10 mx-auto">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Webform Example - Server Side</h2>
          <p>
            This example uses the{" "}
            <a href="https://www.drupal.org/project/next_webform">
              Next.js Webform
            </a>{" "}
            library to render and submit forms built using the Drupal Webform
            module.
          </p>
          <div className="w-full max-w-md p-6 space-y-4 border rounded-md shadow">
            <Webform
              id="contact"
              data={webform}
              className="space-y-6"
              customComponents={{
                textfield: withCustomStyles(
                  components.textfield,
                  fieldProps,
                  labelProps,
                  wrapperProps
                ),
                email: withCustomStyles(
                  components.email,
                  fieldProps,
                  labelProps,
                  wrapperProps
                ),
                textarea: withCustomStyles(
                  components.textarea,
                  fieldProps,
                  labelProps,
                  wrapperProps
                ),
                select: withCustomStyles(
                  components.select,
                  fieldProps,
                  labelProps,
                  wrapperProps
                ),
                webform_actions: withCustomStyles(
                  components.webform_actions,
                  {},
                  {},
                  { className: classNames("my-4", "space-x-4") }
                ),
                button: withCustomStyles(WebformButton, buttonProps, {}, {}),
              }}
            />
          </div>
          <p>
            <Link href="/" passHref>
              <a>Go back</a>
            </Link>
          </p>
        </article>
      </div>
    </>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<WebformPageProps>
> {
  return {
    props: {
      webform: await resolveWebformContent("contact", drupal),
    },
  }
}
