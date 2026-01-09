import * as React from "react"
import classNames from "classnames"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { useRouter } from "next/router"

interface FormSearchProps extends React.HTMLProps<HTMLFormElement> {}

export function FormSearch({ className, ...props }: FormSearchProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const onSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    // Redirect to search page.
    window.location.href = `/${router.locale}/search?keys=${data.get("keys")}`
  }

  return (
    <>
      <Link href="/search" passHref className="md:hidden">
        <span className="sr-only">{t("search")}</span>
        <SearchIcon />
      </Link>
      <form
        className={classNames("text-sm hidden md:flex items-center", className)}
        onSubmit={onSubmit}
        {...props}
      >
        <div className="relative flex-1">
          <label
            htmlFor="keys"
            className="absolute inset-y-0 flex items-center px-2"
          >
            <span className="sr-only">{t("search")}</span>
            <SearchIcon />
          </label>
          <input
            id="keys"
            name="keys"
            required
            className="py-2 pl-10 pr-4 border border-r-0 rounded-l-sm w-60 lg:w-80 border-gray-lighter focus:outline-dotted focus:outline-offset-2 focus:ring-0 focus:outline-link focus:border-gray"
            placeholder={t("search-by-keyword-ingredient-dish")}
          />
        </div>
        <div>
          <input
            type="submit"
            className="flex items-center px-3 py-2 font-serif transition-colors bg-white border rounded-sm rounded-r-sm cursor-pointer border-gray-lighter hover:bg-link/10 hover:border-link"
            value={t("search")}
          />
        </div>
      </form>
    </>
  )
}

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {}

function SearchIcon({ className, ...props }: SearchIconProps) {
  return (
    <svg
      className={classNames("w-5 h-5 text-primary", className)}
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path d="M5.407 9.766 1.13 14.042l.828.827 4.276-4.276a6 6 0 0 1-.827-.827Zm4.611-8.556a4.772 4.772 0 1 0 0 9.543 4.772 4.772 0 0 0 0-9.543ZM6.911 5.47a.467.467 0 1 1 0-.935.467.467 0 0 1 0 .934Zm1.03-1.134A.818.818 0 1 1 7.942 2.7a.818.818 0 0 1-.003 1.637Zm1.652-1.124a.468.468 0 1 1 .005-.937.468.468 0 0 1-.005.937Z" />
        <path
          d="M10.018.017a5.966 5.966 0 0 0-5.23 8.833 1.41 1.41 0 0 0-.399.28L.431 13.088a1.412 1.412 0 0 0 0 1.996l.484.484a1.412 1.412 0 0 0 1.997 0l3.958-3.958c.115-.115.21-.25.28-.398A5.965 5.965 0 1 0 10.018.017Zm-8.06 14.852-.828-.827 4.277-4.276a6 6 0 0 0 .827.827l-4.276 4.276Zm8.06-4.115a4.772 4.772 0 1 1 .002-9.545 4.772 4.772 0 0 1-.003 9.545h.001Z"
          fill="currentColor"
          fillRule="nonzero"
        />
        <circle
          fill="currentColor"
          fillRule="nonzero"
          cx="7.94"
          cy="3.518"
          r="1"
        />
        <circle
          fill="currentColor"
          fillRule="nonzero"
          cx="9.595"
          cy="2.744"
          r="1"
        />
        <circle
          fill="currentColor"
          fillRule="nonzero"
          cx="6.911"
          cy="5.002"
          r="1"
        />
      </g>
    </svg>
  )
}
