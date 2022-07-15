import Link from "next/link"
import React from "react"
import MenubarRow from "./MenubarRow"
import {
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/react/outline"

function Menubar() {
  return (
    <div className="col-span-2 border-gray-100">
      <div className="flex space-x-2">
        <MenubarRow title="Home" Icon={HomeIcon} link="/" />
        <MenubarRow title="Messages" Icon={InboxIcon} link="/" />
        <MenubarRow title="Search" Icon={SearchIcon} link="/" />
        <MenubarRow
          title="Publish hangout"
          Icon={PlusIcon}
          link="/publish-hangout"
        />
        <MenubarRow title="Login" link="/login" />
        <MenubarRow
          title="Sign up"
          link="/signup"
          externalClass="btn hover:bg-blue-500	"
        />
      </div>
    </div>
  )
}

export default Menubar
