import * as React from "react"
import classNames from "classnames"
import Link, { LinkProps } from "next/link"

interface CardProps extends LinkProps {
  children?: React.ReactNode
}

export function Card({ children, href, ...props }: CardProps) {
  return (
    <Link
      href={href}
      passHref
      {...props}
      className={classNames(
        "block p-6 bg-white group border border-gray-200 rounded-lg shadow-md card"
      )}
    >
      {children}
    </Link>
  )
}

type CardHeadingProps = React.HTMLAttributes<HTMLHeadingElement>

export function CardHeading({
  children,
  className,
  ...props
}: CardHeadingProps) {
  return (
    <h3
      className={classNames(
        "mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

type CardBodyProps = React.HTMLAttributes<HTMLDivElement>

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div
      className={classNames("font-normal text-gray-700", className)}
      {...props}
    >
      {children}
    </div>
  )
}
