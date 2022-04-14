import { FormattedText } from "components/formatted-text"

interface PageHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center py-6 space-y-8 text-center lg:py-20">
      <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-center md:text-5xl lg:text-6xl">
        {heading}
      </h1>
      {text && (
        <div className="max-w-2xl mx-auto text-lg text-gray-500">
          <FormattedText text={text} />
        </div>
      )}
      {children}
    </div>
  )
}
