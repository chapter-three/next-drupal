import Image from "next/image"

import { FormNewsletter } from "components/form-newsletter"

interface FooterNewsletterProps {
  heading: string
  text?: string
}

export function FooterNewsletter({ heading, text }: FooterNewsletterProps) {
  return (
    <div className="bg-secondary pb-16 pt-16 md:pb-0 overflow-hidden relative mb-4 lg:mb-12 rounded-[55px]">
      <div className="absolute bottom-0 w-full md:relative">
        <Image
          src="/images/opt-in-block-bg.png"
          layout="intrinsic"
          width={1280}
          height={442}
        />
      </div>
      <div className="inset-0 flex flex-col items-center justify-center max-w-xl px-8 mx-auto space-y-4 lg:max-w-3xl md:absolute lg:space-y-12">
        <div className="text-center">
          <div className="flex flex-col space-y-2 lg:space-y-8">
            <p className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {heading}
            </p>
            {text && (
              <p className="text-sm font-light leading-7 text-center text-black lg:text-base text-opacity-60">
                {text}
              </p>
            )}
          </div>
        </div>
        <div className="w-full max-w-md lg:max-w-lg">
          <FormNewsletter />
        </div>
      </div>
    </div>
  )
}
