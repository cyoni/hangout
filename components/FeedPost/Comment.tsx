import { Avatar } from "@mui/material"
import React from "react"
import { getPastTime } from "../../lib/scripts/general"
import { getFullPlaceName } from "../../lib/scripts/place"
import CustomAvatar from "../CustomAvatar"
import usePlace from "../usePlace"
interface Props extends IComment {
  place: Place
}
function Comment({ message, timestamp, profile, place }: Props) {
  const name = profile[0] ? profile[0].name : undefined
  {
    console.log("profile[0].picture", profile[0].picture)
  }
  return (
    <div className="flex space-x-3 items-center">
      <CustomAvatar
        className="self-start transition duration-200 hover:scale-110"
        name={profile[0].name}
        picture={profile[0].picture}
        userId={profile[0].userId}
      />

      <div>
        <div className="flex gap-2 items-center">
          <div className="font-bold text-lg">{name}</div>
          <div>·</div>
          <div className="text-sm text-gray-400 ">
            {getFullPlaceName(place)}
          </div>
          <div>·</div>
          <div className="text-sm text-gray-400">{getPastTime(timestamp)}</div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Comment
