import {
  ChatBubbleLeftEllipsisIcon,
  InboxIcon,
} from "@heroicons/react/24/outline"
import { IconButton } from "@mui/material"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import React, { Fragment, useState } from "react"
import { formatDate } from "../../lib/dates"
import { getFullPlaceName } from "../../lib/scripts/place"
import ButtonIntegration from "../ButtonIntegration"
import ChatModal from "../ChatModal"
import CustomAvatar from "../CustomAvatar"
import Loader from "../Loader"
import Spinner from "../Spinner"
import useItinerary from "../useItinerary"
import usePlace from "../usePlace"

function Travels({ place }) {

  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)
  const router = useRouter()

  const { cityItineraryQuery } = useItinerary({
    isCity: true,
    cityIds: [place.city_id],
  })

  const travelers = cityItineraryQuery.data
  const hasData =
    Array.isArray(travelers?.pages) && travelers.pages[0]?.travelers?.length > 0

  console.log("travelers", travelers)
  const cityIds: number[] = travelers?.pages.map((page) =>
    page?.travelers?.map((travel) => travel.profile[0].cityId)
  )

  const { places, getPlaceFromObject, placeQuery } = usePlace([cityIds])

  const isLoading = cityItineraryQuery.isFetching 

  console.log("travelers city ids", cityIds)

  return (
    <div className="w-[60%] mx-auto ">
      <div className="flex justify-between">
        <div className="text-2xl">Travelers</div>
        <button
          className="btn"
          onClick={() => router.push(`/publish-hangout/city/${place.city_id}`)}
        >
          Add travel
        </button>
      </div>
      <div className=" py-5 px-10 rounded-md shadow-md mt-4 bg-gray-50 min-h-[700px]">
        {!travelers && <Spinner className="top-0 left-1/2 mt-10" />}
        {hasData && travelers.pages.length > 0 && (
          <div>
            <div className="grid grid-cols-[300px_300px] gap-10 justify-center items-center">
              {travelers.pages.map((page) =>
                page.travelers.map((item, i) => {
                  return (
                    <Fragment key={i}>
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
                              <div className="line-clamp-5">
                                {item.description}
                              </div>
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
                    </Fragment>
                  )
                })
              )}
            </div>
            <ButtonIntegration
              externalClass={`btn block mx-auto mt-8 w-fit ${
                !cityItineraryQuery.hasNextPage ? "disabled" : ""
              }`}
              disabled={!cityItineraryQuery.hasNextPage}
              onClick={() => cityItineraryQuery.fetchNextPage()}
            >
              Show more
            </ButtonIntegration>
          </div>
        )}

        {!isLoading && !hasData && (
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
