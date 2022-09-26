import { Avatar } from "@mui/material"
import React from "react"

interface Props {
  name: string
  className?: string
  picture: string
  userId?: string
  onClick?: Function
  disabled?: boolean
  overrideLetterIfNoPicture?: boolean
}
function CustomAvatar({
  name,
  picture,
  userId,
  className,
  overrideLetterIfNoPicture,
  onClick,
  disabled,
}: Props) {

  const profilePictureUrl = picture
    ? picture.startsWith("http")
      ? picture
      : `${process.env.PICTURES_SERVICE_ENDPOINT}/${picture}`
    : null


  return (
    <Avatar
      className={`${disabled ? "" : "cursor-pointer"} shadow-xl  ${
        className ? className : ""
      }`}
      alt={name}
      src={profilePictureUrl}
      onClick={
        !disabled
          ? onClick
            ? () => onClick()
            : () => window.open(`/profile/${userId}`)
          : null
      }
    >
      {!overrideLetterIfNoPicture ? name?.charAt(0).toUpperCase() : null}
    </Avatar>
  )
}

export default CustomAvatar
