import * as React from "react"
import { formatDate } from "../../lib/scripts/dates"
import { getFullPlaceName } from "../../lib/consts/place"
import generateRandomString from "../../lib/scripts/strings"

export default function TravelTimeLine({ itineraries, getPlaceFromObject }) {
  const Separator = () => {
    return <div className="h-11 ml-1 w-[3px] rounded-lg bg-slate-500"></div>
  }
  const Dot = () => {
    return <span className="text-sm">○</span>
  }
  return (
    <div className="p-2 pr-3 basis-[400px]">
      {itineraries &&
        itineraries.map((itinerary, index) => {
          const place = getPlaceFromObject(itinerary.placeId)
          return (
            <React.Fragment key={generateRandomString(5)}>
              <div className="flex items-center w-full">
                <Dot />
                <div className="ml-4">
                  <div className=" font-bold">
                    {getFullPlaceName(place)}
                  </div>
                  <div className="text-sm">
                    {formatDate(itinerary.startDate)} -{" "}
                    {formatDate(itinerary.endDate)}
                  </div>
                </div>
              </div>

              {index + 1 !== itineraries.length && <Separator />}
            </React.Fragment>
          )
        })}
    </div>
  )
}
