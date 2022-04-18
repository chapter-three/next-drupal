import classNames from "classnames"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={classNames(
        "w-full rounded-md bg-gray-200 animate-pulse",
        className
      )}
    />
  )
}
