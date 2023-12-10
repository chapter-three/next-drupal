import Head from "next/head"
import Link from "next/link"

export default function IndexPage() {
  return (
    <>
      <Head>
        <title key="title">Next.js for Drupal | Webform Example</title>
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
          <h2>Server Side (API Route)</h2>
          <p>
            We submit the form values to a custom API route first. The API route
            then submits the form to Drupal using the{" "}
            <a href="https://www.drupal.org/project/webform_rest">
              Webform REST
            </a>{" "}
            module.
          </p>
          <p>
            This is useful if we need to hide client IDs and secrets or our
            Drupal implementation.
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
