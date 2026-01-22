import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useSession, signOut } from "next-auth/react"
import { Menu, Transition } from "@headlessui/react"
import classNames from "classnames"

import { MenuLink } from "components/menu-link"

export function MenuUser() {
  const { data, status } = useSession()
  const { t } = useTranslation()

  if (status === "loading") {
    return null
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/login" passHref className="text-text hover:underline">
        {t("login")}
      </Link>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="flex space-x-4">
        <Menu as="div" className="relative z-50">
          <Menu.Button className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75">
            {t("my-account")}
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white border divide-y shadow-md border-border divide-border">
              <Menu.Item as="div" className="flex flex-col px-3 py-2">
                <p className="font-semibold">{data.user.name}</p>
                <p className="text-sm truncate text-gray">{data.user.email}</p>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink
                    href="/account"
                    className={classNames(
                      "flex hover:bg-body w-full px-3 py-2 text-text",
                      {
                        "bg-body": active,
                      }
                    )}
                  >
                    {t("my-account")}
                  </MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames("flex w-full px-3 py-2 text-text", {
                      "bg-body": active,
                    })}
                    onClick={() => signOut()}
                  >
                    {t("logout")}
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    )
  }
}
