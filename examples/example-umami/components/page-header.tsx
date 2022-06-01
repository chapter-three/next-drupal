import { BreadcrumbsProps, Breadcrumbs } from "components/breadcrumbs"

interface PageHeaderProps {
  heading: string
  breadcrumbs?: BreadcrumbsProps["items"]
}

export function PageHeader({ heading, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="container">
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex flex-col items-center py-10 space-y-4 text-text md:space-y-8">
        <h1 className="max-w-4xl font-serif text-2xl text-center md:text-5xl lg:text-4xl">
          {heading}
        </h1>
      </div>
    </div>
  )
}
