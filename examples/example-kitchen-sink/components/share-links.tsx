import { useTranslation } from "next-i18next"

interface ShareLinksProps {
  title: string
  href: string
}

// eslint-disable @next/next/no-html-link-for-pages
export function ShareLinks({ title, href }: ShareLinksProps) {
  const { t } = useTranslation("common")
  return (
    <div className="flex flex-col items-center space-y-6 sm:space-x-6 sm:space-y-0 sm:flex-row lg:space-x-0 lg:space-y-6 lg:flex-col">
      <p className="text-sm font-semibold tracking-widest uppercase">
        {t("share-this-on")}
      </p>
      <a
        href={`https://www.facebook.com/sharer.php?u=${href}`}
        title="Share on Facebook"
        target="_blank"
        rel="nofollow noreferrer"
        className="flex items-center justify-center w-10 h-10 text-black transition-colors rounded-full hover:bg-secondary"
      >
        <span className="sr-only">Facebook</span>
        <svg width="10" height="20" viewBox="0 0 10 20" fill="none">
          <path
            d="M8.112 3.295h1.811V.14A23.394 23.394 0 0 0 7.283 0c-2.611 0-4.4 1.643-4.4 4.663v2.779H0v3.527h2.882v8.876h3.535V10.97h2.765l.44-3.527H6.415v-2.43c0-1.02.275-1.718 1.696-1.718Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${href}&text=${title}`}
        title="Share on Twitter"
        target="_blank"
        rel="nofollow noreferrer"
        className="flex items-center justify-center w-10 h-10 text-black transition-colors rounded-full hover:bg-secondary"
      >
        <span className="sr-only">Twitter</span>
        <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
          <path
            d="M22 2.961a9.404 9.404 0 0 1-2.599.712 4.485 4.485 0 0 0 1.984-2.493 9.014 9.014 0 0 1-2.86 1.092 4.509 4.509 0 0 0-7.802 3.084c0 .358.03.702.105 1.029-3.75-.183-7.067-1.98-9.296-4.718a4.54 4.54 0 0 0-.618 2.28c0 1.562.805 2.947 2.004 3.748A4.454 4.454 0 0 1 .88 7.14v.05a4.53 4.53 0 0 0 3.614 4.43 4.5 4.5 0 0 1-1.183.15c-.289 0-.58-.017-.854-.078.585 1.787 2.243 3.1 4.215 3.142a9.062 9.062 0 0 1-5.593 1.924c-.37 0-.724-.017-1.079-.062a12.698 12.698 0 0 0 6.919 2.024c8.3 0 12.837-6.875 12.837-12.834 0-.2-.007-.392-.017-.583A8.999 8.999 0 0 0 22 2.96Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={`https://instagram.com`}
        title="Share on Instagram"
        target="_blank"
        rel="nofollow noreferrer"
        className="flex items-center justify-center w-10 h-10 text-black transition-colors rounded-full hover:bg-secondary"
      >
        <span className="sr-only">Instagram</span>
        <svg width="22" height="23" viewBox="0 0 22 23" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.875.72h8.25A6.876 6.876 0 0 1 22 7.595v8.25a6.876 6.876 0 0 1-6.875 6.875h-8.25A6.876 6.876 0 0 1 0 15.845v-8.25A6.876 6.876 0 0 1 6.875.72Zm8.25 19.937a4.818 4.818 0 0 0 4.813-4.812v-8.25a4.818 4.818 0 0 0-4.813-4.813h-8.25a4.818 4.818 0 0 0-4.813 4.813v8.25a4.818 4.818 0 0 0 4.813 4.812h8.25Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.5 11.72a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Zm2.063 0A3.442 3.442 0 0 0 11 15.158a3.442 3.442 0 0 0 3.438-3.438A3.441 3.441 0 0 0 11 8.282a3.441 3.441 0 0 0-3.438 3.438Z"
            fill="currentColor"
          />
          <circle cx="16.913" cy="5.807" r=".733" fill="currentColor" />
        </svg>
      </a>
    </div>
  )
}
