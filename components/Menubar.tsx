import Link from "next/link"
import React, { useState } from "react"
import MenubarRow from "./MenubarRow"
import {
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/react/outline"
import Avatar from "./Avatar"
import AvatarMenu from "./AvatarMenu"
import { signIn, useSession } from "next-auth/react"

function Menubar({ newMessages }) {
  const session = useSession()
  console.log("session", session)
  const isAuthenticated = session.status === "authenticated"
  const isUnAuthenticated = session.status === "unauthenticated"
  return (
    <div className="col-span-2 border-gray-100">
      <div className="flex items-center space-x-2">
        <MenubarRow title="Home" Icon={HomeIcon} link="/" />
        <MenubarRow
          title="Messages"
          Icon={InboxIcon}
          link="/inbox"
          notifications={newMessages}
        />
        <MenubarRow title="Search" Icon={SearchIcon} link="/" />
        <MenubarRow
          title="Publish hangout"
          Icon={PlusIcon}
          link="/publish-hangout"
        />
        {isAuthenticated && <AvatarMenu />}
        {isUnAuthenticated && (
          <>
            <MenubarRow title="Login" onClick={() => signIn()} link="/" />
            <MenubarRow
              title="Sign up"
              link="/signup"
              externalClass="btn hover:bg-blue-500"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Menubar
