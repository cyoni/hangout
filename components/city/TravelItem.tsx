import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import { formatDate } from "../../lib/scripts/dates"
import { getFullPlaceName } from "../../lib/consts/place"
import ChatModal from "../Modal/ChatModal"
import CustomAvatar from "../Avatar/CustomAvatar"
import IconButtonCustom from "../Buttons/IconButtonCustom"

function TravelItem({ item, getPlaceFromObject }) {
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)

  return (
    <>
      <div className="mt-5 flex max-w-[400px] flex-col rounded-md bg-white px-5 py-5 shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between ">
          <div className="font-bold capitalize">{item.profile.name}</div>
          <IconButtonCustom>
            <ChatBubbleLeftEllipsisIcon
              className="z-50 h-6"
              onClick={() => setIsModalMessageOpen(true)}
            />
          </IconButtonCustom>
        </div>
        <div className="">
          <a href={`/profile/${item.profile[0].userId}?view=trips`}>
            {/* profile image */}
            <div className="mx-auto w-fit ">
              <CustomAvatar
                disabled
                name={item.profile[0].name}
                picture={item.profile[0].picture}
                width="150px"
                height="150px"
                className="h-36 w-36"
              />
            </div>
            {/* info */}
            <div className="mt-5">
              {formatDate(item.itineraries[0].startDate)} -{" "}
              {formatDate(item.itineraries[0].endDate)}
              {/* country */}
              <div className="">
                {getFullPlaceName(getPlaceFromObject(item.profile[0].placeId))}
              </div>
              <div className="line-clamp-5">{item.description}</div>
            </div>
          </a>
        </div>
      </div>

      <ChatModal
        profile={item.profile[0]}
        isModalMessageOpen={isModalMessageOpen}
        setIsModalMessageOpen={setIsModalMessageOpen}
      />
    </>
  )
}

export default TravelItem
