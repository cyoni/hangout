import React from "react"
import { Fragment } from "react"
import Avatar from "./Avatar"
import { signOut } from "next-auth/react"

function AvatarMenu() {
  interface Props {
    title: string
    url?: string
    onClick?: Function
    className?: string
  }
  
  return ( <div>  <Avatar className="h-9 w-9" /></div>
    
  )
}

export default AvatarMenu
