import React from "react"
import Avatar from "./Avatar"
import moment from "moment"
import { getPastTime } from "../lib/scripts/general"
import CustomAvatar from "./CustomAvatar"

interface Props extends MessageObj {
  places: Place[]
}

function PreviewMessage({
  sharedToken,
  senderId,
  theirId,
  message,
  timestamp,
  profile,
  places,
}: Props) {
  const { picture, name, cityId } = profile[0]

  const renderPlace = () => {
    console.log("renderPlace cityId", cityId)
    console.log("places", places)
    const place = places["57564"]
    console.log("place",place)
    if (place) {
      return `${place.city}, ${place.province_short}, ${place.country}`
    }
  }

  const time = getPastTime(timestamp)
  console.log("place", cityId)
  console.log("got places:", places)

  return (
    <div className="relative mx-5 flex gap-7 border-b border-b-gray-100 py-5 pl-5 text-gray-600">
      <div className="absolute left-0 top-3 hidden text-[50px] font-bold text-red-600">
        ·
      </div>
      <div className="flex gap-2">
        <CustomAvatar {...profile[0]} className="h-14 w-14" />
        <div className="w-[200px]">
          <div className="font-bold capitalize">{name}</div>
          <div>{renderPlace()}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col rounded-md  p-3">
        <a href={`/messages/conversation/${theirId}`}>
          <div className="cursor-pointer truncate rounded-md bg-gray-100 p-2 shadow-sm hover:bg-gray-200">
            {message}
          </div>
        </a>
        <div className="ml-auto text-sm">{time}</div>
      </div>
    </div>
  )
}

export default PreviewMessage
