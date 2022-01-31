import { LinksProps, Links } from "components/links"
import { FormattedText } from "components/formatted-text"

interface SectionHeaderProps {
  level?: number
  heading: string
  text: string
  links?: LinksProps["links"]
}

export function SectionHeader({
  level = 2,
  heading,
  text,
  links,
  ...props
}: SectionHeaderProps) {
  const HeadingLevel = `h${level}` as keyof JSX.IntrinsicElements
  return (
    <div className="container px-6 mx-auto text-center" {...props}>
      {heading && (
        <HeadingLevel className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
          {heading}
        </HeadingLevel>
      )}
      {text && (
        <FormattedText
          className="max-w-xl mx-auto mt-2 text-lg font-light leading-tight text-gray-500 sm:text-xl md:text-2xl"
          processed={text}
        />
      )}
      {links?.length ? <Links links={links} /> : null}
    </div>
  )
}
