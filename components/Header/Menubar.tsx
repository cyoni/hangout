import React, { useState } from "react"
import MenubarRow from "./MenubarRow"
import {
  ChatBubbleLeftRightIcon,
  GlobeEuropeAfricaIcon,
} from "@heroicons/react/24/outline"
import AvatarMenu from "./AvatarMenu"
import { signIn, signOut, useSession } from "next-auth/react"
import { isAuthenticated } from "../../lib/scripts/session"
import { useRouter } from "next/router"
import { ListItemIcon, MenuItem } from "@mui/material"
import Logout from "@mui/icons-material/Logout"
import PersonIcon from "@mui/icons-material/Person"

function Menubar({ newMessages }) {
  const router = useRouter()
  const session = useSession()
  const authenticated = isAuthenticated(session)
  const renderMyAvatar = () => {
    return (
      <AvatarMenu session={session}>
        <MenuItem onClick={() => router.push("/profile")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        {/* <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Account
        </MenuItem> */}

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
      <div className="flex items-center space-x-1">
        {/* <MenubarRow title="Notifications" Icon={BellAlertIcon} link="/" /> */}
        {authenticated ? (
          <>
            <MenubarRow
              title="Messages"
              Icon={ChatBubbleLeftRightIcon}
              link="/messages"
              notifications={newMessages}
            />
            <MenubarRow
              title="Publish Trip"
              Icon={GlobeEuropeAfricaIcon}
              link={`/publish-hangout/${
                router.query.placeId ? `city/${router.query.placeId}` : ""
              }`}
            />
            {renderMyAvatar()}
          </>
        ) : (
          <>
            <MenubarRow
              title="Login"
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              link="/"
            />
            <MenubarRow
              title="Sign up"
              link="/signup"
              externalClass="btn hover:bg-blue-500 active:bg-blue-600 "
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Menubar
