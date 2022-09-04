import * as React from "react"
import { formatDate } from "../lib/dates"
import { getFullPlaceName } from "../lib/scripts/place"
import generateRandomString from "../lib/scripts/strings"

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
          const place = getPlaceFromObject(itinerary.place.city_id)
          return (
            <React.Fragment key={generateRandomString(5)}>
              <div className="flex items-center w-full">
                <Dot />
                <div className="flex justify-between items-center w-full">
                  <div className="ml-4 font-bold">
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
