import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@mui/material"
import React, { useState } from "react"
import { formatDate } from "../../lib/dates"
import { getFullPlaceName } from "../../lib/scripts/place"
import ChatModal from "../ChatModal"
import CustomAvatar from "../CustomAvatar"
import IconButtonCustom from "../IconButtonCustom"

function TravelItem({ item, getPlaceFromObject }) {
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)

  return (
    <>
      <div className="mt-5 flex max-w-[400px] flex-col rounded-md px-5 py-5 shadow-md hover:shadow-lg bg-white">
        <div className="flex items-center justify-between ">
          <div className="font-bold capitalize">{item.profile.name}</div>
          <IconButtonCustom>
            <ChatBubbleLeftEllipsisIcon
              className="h-6 z-50"
              onClick={() => setIsModalMessageOpen(true)}
            />
          </IconButtonCustom>
        </div>
        <div className="">
          <a href={`/profile/${item.profile[0].userId}?tab=itinerary`}>
            {/* profile image */}
            <div className="w-fit mx-auto ">
              <CustomAvatar
                name={item.profile[0].name}
                picture={item.profile[0].picture}
                className="w-36 h-36"
              />
            </div>
            {/* info */}
            <div className="mt-5">
              {formatDate(item.itineraries[0].startDate)} -{" "}
              {formatDate(item.itineraries[0].endDate)}
              {/* country */}
              <div className="">
                {getFullPlaceName(getPlaceFromObject(item.profile[0].cityId))}
              </div>
              <div className="line-clamp-5">{item.description}</div>
            </div>
          </a>
        </div>
      </div>

      <ChatModal
        name={item.profile[0].name}
        userId={item.profile[0].userId}
        isModalMessageOpen={isModalMessageOpen}
        setIsModalMessageOpen={setIsModalMessageOpen}
      />
    </>
  )
}

export default TravelItem