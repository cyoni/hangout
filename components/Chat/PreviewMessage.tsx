import React from "react"
import moment from "moment"
import { getPastTime } from "../../lib/scripts/general"
import CustomAvatar from "../Avatar/CustomAvatar"
import { getFullPlaceName } from "../../lib/scripts/place"
import Link from "next/link"

interface Props extends MessageObj {
  places: Place[]
  isRead: boolean
}

function PreviewMessage({
  senderId,
  theirId,
  message,
  timestamp,
  profile,
  isRead,
  places,
}: Props) {
  const { name, placeId } = profile[0]

  const renderPlace = () => {
    console.log("renderPlace placeId", placeId)
    console.log("places", places)
    const place = places[placeId]
    console.log("place", place)
    return getFullPlaceName(place)
  }

  const time = getPastTime(timestamp)
  console.log("place", placeId)
  console.log("got places:", places)

  return (
    <div
      className={`relative mx-5 gap-7 rounded-md border-b border-b-gray-100 py-5 pl-5 text-gray-600 transition-colors duration-1000 hover:bg-sky-100 ${
        !isRead ? "bg-orange-200" : ""
      }`}
    >
      <div className="flex">
        <div className="flex flex-[0.3] gap-2">
          <CustomAvatar {...profile[0]} className="h-14 w-14" />
          <div>
            <div className="font-bold capitalize">{name}</div>
            <div className="text-sm">{renderPlace()}</div>
          </div>
        </div>

        <Link href={`/messages/${theirId}`} className="">
          <div
            className={`h-14 flex-[0.7] cursor-pointer truncate rounded-md p-2`}
          >
            {message}
          </div>
        </Link>

      </div>
      <div className="pr-2 text-right text-sm">{time}</div>
    </div>
  )
}

export default PreviewMessage
