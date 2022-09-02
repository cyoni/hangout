import { Avatar } from "@mui/material"
import React from "react"
import { getPastTime } from "../../lib/scripts/general"
interface Props extends IComment {}
function Comment({ message, timestamp, profile }: Props) {
  return (
    <div className="flex space-x-2 items-center">
      <Avatar className="h-12 w-12 self-start" />
      <div>
        <div className="flex gap-2 items-center">
          <div className="font-bold text-lg">{profile[0].name}</div>
          <div className="">·</div>
          <div className="text-sm text-gray-400">{getPastTime(timestamp)}</div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Comment
