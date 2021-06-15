import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { DrupalMenuLinkContent } from "next-drupal"

import { site } from "@/config"
import { ModeToggle } from "@/components/mode-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"

interface NavbarProps {
  links: DrupalMenuLinkContent[]
}

export function Navbar({ links, ...props }: NavbarProps) {
  const { locale } = useRouter()
  return (
    <header
      position="static|sticky"
      top="0"
      bg="background"
      py="4"
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
        <div w="40">
          <Link href="/" locale={locale} passHref>
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
        </div>
        {links ? <Menu items={links} /> : null}
        <div
          w="40"
          display="flex"
          justifyContent="flex-end"
          position="absolute|static"
          top="6"
          right="4"
        >
          <LocaleSwitcher />
          <ModeToggle ml="4" />
        </div>
      </div>
    </header>
  )
}

function Menu({ items }: { items: DrupalMenuLinkContent[] }) {
  return (
    <ul
      display="inline-grid"
      col={`repeat(${items.length}, minmax(0,auto))`}
      gap="6|12"
      mx="auto"
    >
      {items.map((item) => (
        <MenuLink link={item} key={item.id} />
      ))}
    </ul>
  )
}

function MenuLink({ link }: { link: DrupalMenuLinkContent }) {
  const { asPath } = useRouter()
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false)
  return (
    <li
      key={link.id}
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Link href={link.url} passHref>
        <a
          textDecoration={showDropdown ? "underline" : "none"}
          color="text"
          fontWeight={link.url === asPath ? "semibold" : "normal"}
          py="4"
          _hover={{
            textDecoration: "underline",
          }}
        >
          {link.title}
        </a>
      </Link>
      {showDropdown && link.expanded && link.items?.length ? (
        <ul
          position="absolute"
          boxShadow="sm"
          borderWidth="1"
          bg="background"
          borderRadius="md"
          overflow="hidden"
          zIndex="1000"
          transform="translateY(10px)"
        >
          {link.items.map((item) => (
            <li key={item.id}>
              <Link href={item.url} passHref>
                <a
                  display="block"
                  px="3"
                  py="2"
                  minWidth="150"
                  textDecoration="none"
                  bg={item.url === asPath ? "muted" : "background"}
                  color="text"
                  _hover={{
                    bg: "text",
                    color: "background",
                  }}
                >
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}
