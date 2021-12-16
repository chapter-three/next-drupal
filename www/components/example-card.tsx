import Link from "next/link"

interface ExampleCardProps {
  heading: string
  text?: string
  links?: {
    title: string
    href: string
  }[]
}

export function ExampleCard({
  heading,
  text,
  links,
  ...props
}: ExampleCardProps) {
  return (
    <div className="p-6 mb-6 border rounded-lg" {...props}>
      <h4 className="font-bold">{heading}</h4>
      <p className="mt-1 text-gray-600">{text}</p>
      <ul className="mt-4">
        {links?.map((link) => (
          <li key={link.href} className="mb-1">
            <Link href={link.href}>
              <a className="text-sm text-purple-700 hover:underline">
                {link.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
