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
import { signIn, signOut, useSession } from "next-auth/react"
import { isAuthenticated, isNotAuthenticated } from "../lib/session"
import { useRouter } from "next/router"
import { ListItemIcon, MenuItem } from "@mui/material"
import Logout from "@mui/icons-material/Logout"

function Menubar({ newMessages }) {
  const router = useRouter()
  const session = useSession()
  const renderMyAvatar = () => {
    return (
      <AvatarMenu>
        <MenuItem  onClick={() => router.push("/profile")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </AvatarMenu>
    )
  }
  return (
    <div className="col-span-2 border-gray-100">
      <div className="flex items-center space-x-2">
        <MenubarRow title="Notifications" Icon={HomeIcon} link="/" />
        <MenubarRow
          title="Messages"
          Icon={InboxIcon}
          link="/messages"
          notifications={newMessages}
        />
   
        <MenubarRow
          title="Publish hangout"
          Icon={PlusIcon}
          link={`/publish-hangout/${
            router.query.city_id ? `city/${router.query.city_id}` : ""
          }`}
        />
        {isAuthenticated(session) && renderMyAvatar()}
        {isNotAuthenticated(session) && (
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
