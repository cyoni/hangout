import {
  ChatBubbleLeftEllipsisIcon,
  InboxIcon,
} from "@heroicons/react/24/outline"
import { IconButton } from "@mui/material"
import Link from "next/link"
import React, { useState } from "react"
import { formatDate } from "../../lib/dates"
import { getFullPlaceName } from "../../lib/scripts/place"
import ChatModal from "../ChatModal"
import CustomAvatar from "../CustomAvatar"
import Spinner from "../Spinner"
import useItinerary from "../useItinerary"
import usePlace from "../usePlace"

function Travels({ place }) {
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)

  const { cityItineraryQuery } = useItinerary({
    isCity: true,
    cityIds: [place.city_id],
  })

  console.log("abcdfg", place.city_id)

  const travelers = cityItineraryQuery.data
  console.log("travelers", travelers)
  const cityIds = travelers?.map((travel) => {
    return travel.profile[0].cityId
  })

  const { places, getPlaceFromObject, placeQuery } = usePlace([cityIds])

  const isLoading = cityItineraryQuery.isFetching || placeQuery.isFetching

  console.log("travelers city ids", cityIds)

  return (
    <div className="w-[60%] mx-auto ">
      <div className="text-2xl">Travelers</div>
      <div className=" py-5 px-10 rounded-md shadow-md mt-4 bg-gray-50 min-h-[700px]">
        {isLoading && (
          <div className="relative">
            <Spinner className="absolute top-0 left-1/2 mt-10" />
          </div>
        )}

        {!isLoading && Array.isArray(travelers) && travelers.length > 0 && (
          <div className="grid grid-cols-2 gap-5  justify-center max-w-[600px]">
            {travelers.map((item, i) => {
              console.log("item", item)
              return (
                <>
                  <div className="mt-5 flex max-w-[400px] flex-col rounded-md px-5 py-5 shadow-md hover:shadow-lg bg-white">
                    <div className="flex items-center justify-between ">
                      <div className="font-bold capitalize">
                        {item.profile.name}
                      </div>
                      <IconButton>
                        <ChatBubbleLeftEllipsisIcon
                          className="h-6 z-50"
                          onClick={() => setIsModalMessageOpen(true)}
                        />
                      </IconButton>
                    </div>
                    <div className="">
                      <a
                        href={`/profile/${item.profile[0].userId}?tab=itinerary`}
                      >
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
                            {getFullPlaceName(
                              getPlaceFromObject(item.profile[0].cityId)
                            )}
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
            })}
          </div>
        )}

        {!isLoading && (!travelers || travelers.length == 0) && (
          <div className=" text-center text-3xl my-20 ">
            No travelers yet
            <p>
              <button className="btn mt-7">Invite a friend</button>
            </p>
          </div>
        )}
      </div>
      <div className="link w-fit">
        {/* <Link
                href={`/more-travels?country=${location?.country}&state=${location?.state}&city=${location?.city}`}
              >
                More
              </Link> */}
      </div>
    </div>
  )
}

export default Travels
