import Link from "next/link"
import React from "react"
import MenubarRow from "./MenubarRow"
import { HomeIcon, InboxIcon, PlusIcon, SearchIcon } from "@heroicons/react/outline"

function Menubar() {
  return (
    <div className="col-span-1 w-60 border-r border-gray-100">
      <div className="flex flex-col mt-5 px-1 ">
        <MenubarRow title="Home" Icon={HomeIcon} />
        <MenubarRow title="Messages" Icon={InboxIcon} />
        <MenubarRow title="Search" Icon={SearchIcon} />
        <MenubarRow title="Publish hangout" Icon={PlusIcon} />
{/*         
        <Link href="/">
          <a className="">Home</a>
        </Link>
        <Link href="login">
          <a className="">Login</a>
        </Link>
        <Link href="signup">
          <a className="">Sign up</a>
        </Link>
        <Link href="publish-hangout">
          <a className="">Publish hangout</a>
        </Link> */}
      </div>
    </div>
  )
}

export default Menubar
