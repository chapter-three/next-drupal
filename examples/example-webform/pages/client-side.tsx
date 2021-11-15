import * as React from "react"
import { GetStaticPropsResult } from "next"
import Head from "next/head"
import Link from "next/link"
import { getResourceCollection, DrupalTaxonomyTerm } from "next-drupal"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { contactFormSchema } from "../validations/contact"

type FormData = yup.TypeOf<typeof contactFormSchema>

interface WebformPageProps {
  teams: DrupalTaxonomyTerm[]
}

export default function WebformPage({ teams }: WebformPageProps) {
  const [status, setStatus] = React.useState<"error" | "success">()
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: yupResolver(contactFormSchema),
  })

  // This makes a client side POST to our Drupal site.
  // The Drupal base URL and the webform_id are exposed.
  async function onSubmit(data: FormData) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/webform_rest/submit`,
      {
        method: "POST",
        body: JSON.stringify({
          webform_id: "contact",
          ...data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (response.ok) {
      reset()
      return setStatus("success")
    }

    return setStatus("error")
  }

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Webform Example</title>
      </Head>
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Webform Example - Client Side</h2>
          <p>
            We use the{" "}
            <a href="https://www.drupal.org/project/webform_rest">
              Webform REST
            </a>{" "}
            module to submit the form values directly to Drupal.
          </p>
          <div className="w-full space-y-4 max-w-md rounded-md border shadow p-6">
            {status === "error" ? (
              <div className="border-red-200 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
                An error occured. Please try again.
              </div>
            ) : null}
            {status === "success" ? (
              <div className="border-green-200 bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm">
                Your message has been sent. Thank you.
              </div>
            ) : null}
            {Object.values(formState.errors)?.length ? (
              <div className="border-red-200 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
                {Object.values(formState.errors).map((error, index) => (
                  <p key={index}>{error.message}</p>
                ))}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("name")}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("email")}
                />
              </div>
              <div>
                <label
                  htmlFor="team"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team
                </label>
                <select
                  id="team"
                  name="team"
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("team")}
                >
                  <option value="">-- Select --</option>
                  {teams.map((team) => (
                    <option value={team.drupal_internal__tid} key={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("subject")}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="mt-1 appearance-none h-32 rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("message")}
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black"
              >
                Submit
              </button>
            </form>
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
  // Load terms terms for the contact form.
  return {
    props: {
      teams: await getResourceCollection("taxonomy_term--team"),
    },
  }
}
