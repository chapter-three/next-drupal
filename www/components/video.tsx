import classNames from "classnames"
import * as React from "react"

interface VideoProps {
  src: string
  heading?: string
}

export function Video({ src, heading, ...props }: VideoProps) {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    setIsPlaying(false)
  }, [src])

  return (
    <div className="relative mb-6 overflow-hidden border-2 border-black rounded-lg aspect-w-16 aspect-h-9">
      {heading ? (
        <button
          className={classNames(
            "appearance-none absolute inset-0 bg-white z-10 flex-col items-center justify-center group",
            isPlaying ? "hidden" : "flex"
          )}
          onClick={() => {
            setIsPlaying(true)
            videoRef.current?.play()
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 mb-4 transition-all scale-100 rounded-full group-hover:scale-125">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium uppercase">{heading}</span>
        </button>
      ) : null}
      <video controls muted key={src} ref={videoRef} {...props}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
