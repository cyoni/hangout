import React from "react"
import Link from "next/link"
import { InboxIcon } from "@heroicons/react/24/outline"
import { formatDate } from "../../lib/dates"
import FeedPost from "../FeedPost"
function useTravelers() {
  const handleTravelRoute = (userId) => {
    return `/intro?userId=${userId}`
  }

  const Travelers = ({ travelers }) => {
    return (
      <div className=" w-[60%] mx-auto">
        <div className="text-2xl">Travelers</div>
        <div className=" grid grid-cols-2 gap-5 py-5 px-10 rounded-md shadow-md mt-4 bg-gray-50">
          {Array.isArray(travelers) &&
            travelers.map((item, i) => {
              return (
                <Link key={i} href={handleTravelRoute(item.userId)}>
                  <div className="mt-5 flex cursor-pointer flex-col rounded-md px-5 py-5 shadow-md hover:shadow-lg bg-white">
                    <div className="flex items-center justify-between ">
                      <div className="font-bold capitalize">
                        {item.profile.name}
                      </div>
                      <Link
                        href={`/messages/conversation/${item.userId}?name=${item.profile.name}`}
                      >
                        <InboxIcon className="h-10  rounded-full p-2 hover:bg-gray-100 " />
                      </Link>
                    </div>
                    <div className="flex space-x-2">
                      {/* profile image */}
                      <div className="w-52 h-52">
                        {
                          <img
                            className="w-full h-full rounded-md shadow-md"
                            src={item.profile.picture}
                            alt="pic"
                          />
                        }
                      </div>
                      {/* info */}
                      <div className="w-[180px]">
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                        {/* country */}
                        {item.location?.country && (
                          <div className="{styles.upcoming.item}">
                            {item.location.country}
                          </div>
                        )}
                        <div className="line-clamp-5">{item.description}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
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

  return { Travelers }
}

export default useTravelers
