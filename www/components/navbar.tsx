import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Icon, useColorMode, VisuallyHidden } from "reflexjs"
import { AnimatePresence, motion } from "framer-motion"

import { DocSearch } from "components/doc-search"
import { SidebarNav } from "components/sidebar-nav"

import { docs } from "config/docs"
import { site } from "config/site"

export function Navbar() {
  const [showMenu, setShowMenu] = React.useState(false)
  const [colorMode, setColorMode] = useColorMode()

  return (
    <header
      borderBottomWidth="1px"
      position="relative|sticky"
      top="0"
      zIndex="1000"
      sx={{
        ":after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          w: "full",
          h: "100%",
          zIndex: 10,
          bg: "background",
          opacity: "0.85",
          backdropFilter: "saturate(100%) blur(10px)",
        },
      }}
    >
      <div
        variant="container"
        display="flex"
        alignItems="center"
        h="14"
        position="relative"
        zIndex="1000"
      >
        <button
          display="block|block|block|none"
          mr="2"
          onClick={() => setShowMenu(!showMenu)}
          color="text"
        >
          <Icon name="menu-alt" size="6" />
        </button>
        <Link href="/" passHref>
          <a
            display="none|flex"
            textDecoration="none"
            color="primary"
            alignItems="center"
            fontSize="md|||xl"
            fontWeight="semibold"
            mr="0|0|0|10"
          >
            <Icon name="logo" size="6" mr="2" />
            {site.name}
          </a>
        </Link>
        <div
          display="none|none|none|inline-grid"
          col={`repeat(${site.links.length}, minmax(0,auto))`}
          gap="8"
        >
          {site.links.map((link, index) => (
            <NavbarLink
              key={index}
              href={link.url}
              external={link.external}
              activePathNames={link.activePathNames}
            >
              {link.title}
            </NavbarLink>
          ))}
        </div>
        <div display="flex" ml="0|auto" flex="1|none">
          <DocSearch ml="4" mr="4" flex="1" />
          <a
            href={`https://github.com/${site.social.github}`}
            target="_blank"
            rel="noreferrer"
            variant="button.navbar"
            ml="auto|0"
          >
            <Icon name="github" />
          </a>
          <button
            variant="button.navbar"
            onClick={() =>
              setColorMode(colorMode === "dark" ? "light" : "dark")
            }
          >
            <Icon name={colorMode === "dark" ? "sun" : "moon"} size="5" />
            <VisuallyHidden>Toggle color mode</VisuallyHidden>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showMenu ? (
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -50,
            }}
            transition={{
              ease: "easeInOut",
            }}
            sx={{
              px: 6,
              top: "18|18",
              position: "absolute",
              w: "full",
            }}
          >
            <div
              boxShadow="xl"
              borderWidth="1"
              rounded="lg"
              bg="background"
              w="full"
              h="85vh"
              overflow="scroll"
            >
              <div
                display="grid"
                row={`repeat(${site.links.length}, minmax(0,auto))`}
                gap="2|2|2|8"
                zIndex="100"
                position="relative"
                py="4|4|4|0"
              >
                {site.links.map((link) => (
                  <NavbarLink
                    key={link.url}
                    href={link.url}
                    external={link.external}
                    activePathNames={link.activePathNames}
                    fontWeight="medium"
                    fontSize="xl"
                    py="0"
                  >
                    {link.title}
                  </NavbarLink>
                ))}
              </div>
              <div p="6" borderTopWidth="1">
                <SidebarNav
                  items={docs.links}
                  onLinkClick={() => setShowMenu(false)}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export interface NavbarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  external?: boolean
  activePathNames?: string[]
  children: React.ReactNode
}

export function NavbarLink({
  href,
  external = false,
  activePathNames,
  children,
  ...props
}: NavbarLinkProps) {
  const { pathname } = useRouter()
  const isActive = pathname === href || activePathNames?.includes(pathname)
  return (
    <Link href={href} passHref>
      <a
        textDecoration="none"
        color={isActive ? "link" : "text"}
        fontSize="xl|md"
        px="6|6|6|0"
        py="2|2|2|0"
        fontWeight={isActive ? "semibold" : "normal"}
        _hover={{
          color: "primary",
          textDecoration: "underline",
        }}
        target={external ? "_blank" : "_self"}
        rel={external ? "noreferrer" : ""}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}
