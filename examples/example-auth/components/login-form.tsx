import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

export function LoginForm() {
  const router = useRouter()
  const [hasError, setHasError] = React.useState<boolean>(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (!result.ok) {
      setHasError(true)
    }

    router.push("/")
  }

  return (
    <>
      <div className="max-w-sm w-full space-y-4 border p-8 rounded-md shadow">
        {hasError ? (
          <div className="border-red-200 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
            Unrecognized username or password.
          </div>
        ) : null}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="flex w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black"
          >
            Login
          </button>
        </form>
        <div className="text-center m-0 text-gray-400 text-md font-light">
          or
        </div>
        <button
          onClick={() => signIn("drupal")}
          className="flex w-full justify-center items-center py-2 px-4 border border-blue-500 shadow-sm text-sm font-medium rounded-md text-blue-500 bg-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
            <path
              fill="currentColor"
              d="M15.78 5.113C14.09 3.425 12.48 1.815 11.998 0c-.48 1.815-2.09 3.425-3.778 5.113-2.534 2.53-5.405 5.4-5.405 9.702a9.184 9.185 0 1 0 18.368 0c0-4.303-2.871-7.171-5.405-9.702M6.72 16.954c-.563-.019-2.64-3.6 1.215-7.416l2.55 2.788a.218.218 0 0 1-.016.325c-.61.625-3.204 3.227-3.527 4.126-.066.186-.164.18-.222.177M12 21.677a3.158 3.158 0 0 1-3.158-3.159 3.291 3.291 0 0 1 .787-2.087c.57-.696 2.37-2.655 2.37-2.655s1.774 1.988 2.367 2.649a3.09 3.09 0 0 1 .792 2.093A3.158 3.158 0 0 1 12 21.677m6.046-5.123c-.068.15-.223.398-.431.405-.371.014-.411-.177-.686-.583-.604-.892-5.864-6.39-6.848-7.455-.866-.935-.122-1.595.223-1.94C10.736 6.547 12 5.285 12 5.285s3.766 3.574 5.336 6.016c1.57 2.443 1.029 4.556.71 5.253"
            />
          </svg>{" "}
          Continue with Drupal
        </button>
      </div>
    </>
  )
}
