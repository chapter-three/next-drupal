import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useSession } from "next-auth/react"

export function MenuUser() {
  const { data, status } = useSession()
  const { t } = useTranslation()

  if (status === "loading") {
    return null
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/api/auth/signin" passHref>
        <a className="text-text">{t("login")}</a>
      </Link>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="flex space-x-4">
        <p>
          {t("welcome-back")}{" "}
          <span className="font-semibold">{data.user.name}</span>
        </p>
        <Link href="/api/auth/signout" passHref>
          <a className="text-text">{t("Log out")}</a>
        </Link>
      </div>
    )
  }
}
