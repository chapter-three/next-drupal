import * as React from "react"
import classNames from "classnames"
import { useTranslation } from "next-i18next"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

interface FormLoginProps extends React.HTMLProps<HTMLFormElement> {}

interface FormStatus {
  status: "success" | "error" | "fetching"
  message?: string
}

export function FormLogin({ className, ...props }: FormLoginProps) {
  const [formStatus, setFormStatus] = React.useState<FormStatus>(null)
  const { t } = useTranslation()
  const router = useRouter()

  React.useEffect(() => {
    if (router.query.error === "CredentialsSignin") {
      return setFormStatus({
        status: "error",
        message: t("unrecognized-username-or-password-please-try-again"),
      })
    }

    return setFormStatus(null)
  }, [router, t])

  const onSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    setFormStatus({ status: "fetching" })

    await signIn("credentials", {
      username: data.get("username"),
      password: data.get("password"),
    })

    return setFormStatus({
      status: "success",
    })
  }

  return (
    <form
      className={classNames("grid gap-4", className)}
      onSubmit={onSubmit}
      {...props}
    >
      {formStatus?.message && (
        <p
          className={classNames("py-3 px-4 border", {
            "border-link bg-link/10 text-link":
              formStatus?.status === "success",
            "border-error bg-error/10 text-error":
              formStatus?.status === "error",
          })}
        >
          {formStatus.message}
        </p>
      )}
      <div className="grid gap-2">
        <label htmlFor="username" className="font-semibold text-text">
          {t("username")} <span className="text-sm text-red-500">*</span>
        </label>
        <input
          id="username"
          name="username"
          maxLength={255}
          required
          className="px-2 py-3 border-2 border-gray focus:outline-dotted focus:outline-offset-2 focus:ring-0 focus:outline-link focus:border-gray"
        />
        <p className="text-sm text-text">{t("enter-your-drupal-username")}</p>
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className="font-semibold text-text">
          {t("password")} <span className="text-sm text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="px-2 py-3 border-2 border-gray focus:outline-dotted focus:outline-offset-2 focus:ring-0 focus:outline-link focus:border-gray"
        />
        <p className="text-sm text-text">
          {t("enter-the-password-that-accompanies-your-username")}
        </p>
      </div>
      <div>
        <input
          type="submit"
          className="px-6 py-3 font-serif text-xl text-white transition-colors border-2 rounded-sm cursor-pointer bg-link hover:bg-white hover:text-black border-link"
          disabled={formStatus?.status === "fetching"}
          value={
            formStatus?.status === "fetching" ? t("please-wait") : t("login")
          }
        />
      </div>
    </form>
  )
}
