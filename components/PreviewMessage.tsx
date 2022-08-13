import React from "react"
import Avatar from "./Avatar"
import moment from "moment"

interface Props {
  _id: string
  sharedToken: string
  senderId: string
  message: string
  timestamp: number
  name: string
  picture: string
  place: Place
  places: Place[]
  profile: {}
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
  const renderPlace = () => {
    const place = places[profile[0]?.cityId]
    if (place) {
      return `${place.city}, ${place.province_short}, ${place.country}`
    }
  }
  const time = timestamp > 0 ? moment(timestamp).fromNow() : ""
  console.log("place", profile[0]?.cityId)
  console.log("got places:", places)
  return (
    <div className="relative mx-5 flex gap-7 border-b border-b-gray-100 py-5 pl-5 text-gray-600">
      <div className="absolute left-0 top-3 hidden text-[50px] font-bold text-red-600">
        ·
      </div>
      <div className="flex gap-2">
        <a href={`/profile/${theirId}`}>
          <Avatar className="h-14 w-14" />
        </a>

        <div className="">
          <div className="font-bold capitalize">{profile[0]?.name}</div>
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
