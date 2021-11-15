import Head from "next/head"
import { signOut, useSession } from "next-auth/react"
import { LoginForm } from "../components/login-form"

export default function IndexPage() {
  const { data, status } = useSession()

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Authentication Example</title>
      </Head>
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Authentication Example</h2>
          <p>
            This is an example on how to implement authentication in Next.js for
            Drupal.
          </p>
          <p>
            There are two OAuth 2.0 grants implemented: the{" "}
            <strong>Password Grant</strong> and the{" "}
            <strong>Authorization Code Grant</strong>.
          </p>
          <h3>Password Grant</h3>
          <p>
            The Password grant allows users to login with their credentials i.e
            a username and a password.
          </p>
          <h3>Authorization Code Grant</h3>
          <p>
            The Authorization Code Grant redirects the user to the authorization
            server, in this case Drupal, for authentication.
          </p>
          <p>
            The user will then be asked to login to the authorization server and
            approve the client.
          </p>
          <h2>Login to your Account</h2>
          <p>
            You can use username: <strong>member</strong> and password:{" "}
            <strong>member</strong> to login.
          </p>
          {status !== "loading" ? (
            <>
              {status === "unauthenticated" ? (
                <LoginForm />
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-4 rounded-lg shadow-sm bg-yellow-100">
                  <div className="mb-2">
                    You are now logged in as{" "}
                    <strong>
                      {data.user.name} ({data.user.email})
                    </strong>
                  </div>
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className="inine-flex max-w-xs w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : null}
          <p>
            We are using <a href="http://next-auth.js.org">next-auth</a> to
            handle authentication on the Next.js side and{" "}
            <a href="https://www.drupal.org/project/simple_oauth">
              Simple OAuth
            </a>{" "}
            on the Drupal side.
          </p>
          <h2>Documentation</h2>
          See{" "}
          <a href="https://next-drupal.org/docs/authentication">
            https://next-drupal.org/docs/authentication
          </a>
        </article>
      </div>
    </>
  )
}
