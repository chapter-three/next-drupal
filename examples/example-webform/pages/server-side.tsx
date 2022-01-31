import * as React from "react"
import { GetStaticPropsResult } from "next"
import Head from "next/head"
import Link from "next/link"
import { getResourceCollection, DrupalTaxonomyTerm } from "next-drupal"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

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

  // This makes a POST to a custom API route.
  // The Drupal base URL and the webform_id are NOT exposed.
  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/contact`, {
      method: "POST",
      body: JSON.stringify(data),
    })

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
      <div className="container max-w-2xl px-6 py-10 mx-auto">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Webform Example - Server Side</h2>
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
          <div className="w-full max-w-md p-6 space-y-4 border rounded-md shadow">
            {status === "error" ? (
              <div className="px-4 py-2 text-sm text-red-600 bg-red-100 border-red-200 rounded-md">
                An error occured. Please try again.
              </div>
            ) : null}
            {status === "success" ? (
              <div className="px-4 py-2 text-sm text-green-600 bg-green-100 border-green-200 rounded-md">
                Your message has been sent. Thank you.
              </div>
            ) : null}
            {Object.values(formState.errors)?.length ? (
              <div className="px-4 py-2 text-sm text-red-600 bg-red-100 border-red-200 rounded-md">
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
                  className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
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
                  className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
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
                  className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
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
                  className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
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
                  className="relative block w-full h-32 px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  {...register("message")}
                ></textarea>
              </div>
              <button
                type="submit"
                data-cy="btn-submit"
                className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-black"
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
