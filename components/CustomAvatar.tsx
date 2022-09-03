import { Avatar } from "@mui/material"
import React from "react"

interface Props {
  name: string
  className?: string
  picture: string
  userId?: string
  onClick?: Function
}
function CustomAvatar({ name, picture, userId, className, onClick }: Props) {
  return (
    <Avatar
      className={`h-12 w-12 cursor-pointer ${className ? className : ""}`}
      alt={name.charAt(0)}
      src={picture}
      onClick={
        onClick ? () => onClick() : () => window.open(`/profile/${userId}`)
      }
    />
  )
}

export default CustomAvatar
