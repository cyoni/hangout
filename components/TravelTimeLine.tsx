import * as React from "react"
import generateRandomString from "../lib/scripts/strings"

export default function TravelTimeLine({ itineraries }) {
  const Separator = () => {
    return <div className="h-11 ml-1 w-[3px] rounded-lg bg-slate-500"></div>
  }
  const Dot = () => {
    return <span className="text-sm">○</span>
  }
  return (
    <div className="p-2 basis-[30%]">
      {itineraries &&
        itineraries.map((itinerary) => {
          console.log("itineraryitinerary",itinerary)
          return (
            <React.Fragment key={generateRandomString(5)}>
              <div className="flex space-x-3 items-center">
                <Dot />
                <div className="ml-4 font-bold">{itinerary.place.city_id}</div>
                <div>{itinerary.startDate} - {itinerary.endDate}</div>
              </div>
              <Separator />
            </React.Fragment>
          )
        })}

      
    </div>
  )
}
