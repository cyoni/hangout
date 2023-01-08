import { Avatar } from "@mui/material"
import React from "react"

interface Props {
  name: string
  className?: string
  picture: string
  userId?: string
  onClick?: Function
  disabled?: boolean
  height?: string
  width?: string
  overrideLetterIfNoPicture?: boolean
}
function CustomAvatar({
  name,
  picture,
  userId,
  className,
  overrideLetterIfNoPicture,
  onClick,
  height,
  width,
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
      sx={{ height, width }}
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
