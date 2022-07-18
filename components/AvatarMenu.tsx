import React from "react"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import Avatar from "./Avatar"

function AvatarMenu() {
  interface Props {
    title: string
    url?: string
  }
  const MenuItem = ({ title, url }: Props) => {
    return (
      <Menu.Item>
        {({ active }) => (
          <a
            href={url}
            className={`${
              active ? "bg-gray-100 text-gray-900" : "text-gray-700"
            } text-md block px-4 py-2 `}
          >
            {title}
          </a>
        )}
      </Menu.Item>
    )
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="">
          <Avatar />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-56 
                    origin-top-right rounded-md bg-white 
                    shadow-lg ring-1 ring-black 
                    ring-opacity-5 focus:outline-none"
        >
          <MenuItem title="Profile" url="/" />
          <MenuItem title="Log Out" url="/logout" />
          <div className="py-1"></div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default AvatarMenu
