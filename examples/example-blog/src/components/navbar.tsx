import Link from "next/link"
import { site } from "@/config"
import { ModeToggle } from "./mode-toggle"
import { NavbarLink } from "./navbar-link"

export function Navbar({ ...props }) {
  return (
    <header
      position="static|sticky"
      top="0"
      bg="background"
      opacity="0.85"
      py="8"
      zIndex="1000"
      backdropFilter="saturate(100%) blur(10px)"
      {...props}
    >
      <div
        variant="container"
        display="flex"
        flexDirection="column|row"
        alignItems="flex-start|center"
        justifyContent="space-between"
      >
        <Link href="/" passHref>
          <a
            display="flex"
            textDecoration="none"
            color="text"
            alignItems="center"
            fontSize="4xl|xl"
            fontWeight="semibold"
            mr="0|10"
            mb="2|0"
          >
            {site.name}
          </a>
        </Link>
        <div
          display="flex"
          alignItems="center"
          w="100%"
          justifyContent="space-between|flex-end"
          ml="0|auto"
        >
          <div
            display="inline-grid"
            col={`repeat(${site.links.length}, minmax(0,auto))`}
            gap="6"
          >
            {site.links.map((link) => (
              <NavbarLink key={link.url} href={link.url}>
                {link.title}
              </NavbarLink>
            ))}
          </div>
          <ModeToggle ml="4" />
        </div>
      </div>
    </header>
  )
}
