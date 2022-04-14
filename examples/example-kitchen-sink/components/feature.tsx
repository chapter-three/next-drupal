import { Image } from "types"

interface FeatureProps {
  id: string
  heading: string
  text?: string
  image?: Image
  link: {
    title: string
    href: string
  }
}

export function Feature({
  heading,
  text,
  image,
  link,
  ...props
}: FeatureProps) {
  return (
    <section {...props}>
      <div className="container px-6 py-32 mx-auto lg:px-8">
        <h2 className="text-5xl font-semibold">{heading}</h2>
      </div>
    </section>
  )
}
