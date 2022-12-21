import Head from "next/head"
import Link from "next/link"
import * as React from "react"

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Next.js for Drupal | Webform Example</title>
      </Head>
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Webform Example</h2>
          <p>
            This is an example on how to implement webform in Next.js for
            Drupal.
          </p>
          <p>
            There are two ways you can submit webforms to your Drupal site:{" "}
            <strong>Client side</strong> and{" "}
            <strong>Server side (API route)</strong>.
          </p>
          <h2>Client Side</h2>
          <p>
            We use the{" "}
            <a href="https://www.drupal.org/project/webform_rest">
              Webform REST
            </a>{" "}
            module to submit the form values to Drupal.
          </p>
          <p>
            <Link href="/client-side" passHref>
              <a>See Example</a>
            </Link>
          </p>
          <h2>Server Side</h2>
          <p>
            This example uses the{" "}
            <a href="https://www.drupal.org/project/next_webform">
              Next.js Webform
            </a>{" "}
            library to render and submit forms built using the Drupal Webform
            module.
          </p>
          <p>
            <Link href="/server-side" passHref>
              <a>See Example</a>
            </Link>
          </p>
          <h2>Documentation</h2>
          See{" "}
          <a href="https://next-drupal.org/docs/guides/webform">
            https://next-drupal.org/docs/guides/webform
          </a>
        </article>
      </div>
    </>
  )
}
