import React from "react"
import moment from "moment"
import { getPastTime } from "../../lib/scripts/general"
import CustomAvatar from "../Avatar/CustomAvatar"

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
  isRead,
  places,
}: Props) {
  const { picture, name, cityId } = profile[0]

  const renderPlace = () => {
    console.log("renderPlace cityId", cityId)
    console.log("places", places)
    const place = places["57564"]
    console.log("place", place)
    if (place) {
      return `${place.city}, ${place.province_short}, ${place.country}`
    }
  }

  const time = getPastTime(timestamp)
  console.log("place", cityId)
  console.log("got places:", places)

  return (
    <div
      className={`relative mx-5 flex cursor-pointer gap-7 rounded-md border-b border-b-gray-100 py-5 pl-5 text-gray-600 transition-colors duration-1000 hover:bg-sky-100 ${
        !isRead ? "bg-orange-200" : ""
      }`}
    >
      <div className="flex gap-2">
        <CustomAvatar {...profile[0]} className="h-14 w-14" />
        <div className="w-[200px]">
          <div className="font-bold capitalize">{name}</div>
          <div>{renderPlace()}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col rounded-md  p-3">
        <a href={`/messages/conversation/${theirId}`}>
          <div
            className={`h-14 cursor-pointer truncate rounded-md p-2  `}
          >
            {message}
          </div>
        </a>
        <div className="ml-auto text-sm">{time}</div>
      </div>
    </div>
  )
}

export default PreviewMessage
