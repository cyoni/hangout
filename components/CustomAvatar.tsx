import { Avatar } from "@mui/material"
import React from "react"

interface Props {
  name: string
  className?: string
  picture: string
  userId?: string
  onClick?: Function
  disabled?: boolean
}
function CustomAvatar({
  name,
  picture,
  userId,
  className,
  onClick,
  disabled,
}: Props) {
  return (
    <Avatar
      className={`${disabled ? "" : "cursor-pointer"} shadow-xl  ${
        className ? className : ""
      }`}
      alt={name?.charAt(0).toUpperCase()}
      src={
        picture
          ? `${process.env.PICTURES_SERVICE_ENDPOINT}/${picture}`
          : "no-pic"
      }
      onClick={
        !disabled
          ? onClick
            ? () => onClick()
            : () => window.open(`/profile/${userId}`)
          : null
      }
    />
  )
}

export default CustomAvatar
