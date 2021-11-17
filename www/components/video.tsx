import * as React from "react"
import { Icon } from "reflexjs"

interface VideoProps {
  src: string
  heading?: string
}

export function Video({ src, heading, ...props }: VideoProps) {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <div
      borderWidth="2px"
      borderColor="text"
      borderRadius="lg"
      position="relative"
      pb="56.25%"
      height="0"
      overflow="hidden"
      maxWidth="100%"
    >
      {heading ? (
        <button
          position="absolute"
          top="0"
          left="0"
          zIndex="100"
          bg="white"
          width="100%"
          height="100%"
          display={isPlaying ? "none" : "flex"}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          cursor="pointer"
          _hover={{
            "> div": {
              transform: "scale(1.15)",
            },
          }}
          onClick={() => {
            setIsPlaying(true)
            videoRef.current?.play()
          }}
        >
          <div
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="#111"
            color="white"
            width="16"
            height="16"
            borderRadius="full"
            mb="4"
            transition="all .15s ease-in-out"
          >
            <Icon
              name="play"
              width="8"
              height="8"
              transform="translateX(2px)"
            />
          </div>
          <span fontSize="2xl" fontWeight="black">
            {heading}
          </span>
        </button>
      ) : null}
      <video
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        controls
        muted
        ref={videoRef}
        {...props}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
