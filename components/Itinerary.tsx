import React from "react"
import TravelTimeLine from "./TravelTimeLine"

function Itinerary({ description, itineraries }) {

  return (
    <div className=" justify-evenly mt-2 min-h-[200px] rounded-md  border p-2">
      <div className="flex">
        <button className="btn-outline border ml-auto h-8 rounded-md">
          Edit Itinerary
        </button>
      </div>
      <div className="flex flex-row-reverse	 justify-between">
        <div className="p-2 text-lg rounded-md basis-[65%]">
          {description}
        </div>
        <div className="border-l "></div>
        <TravelTimeLine itineraries={itineraries} />
      </div>
      {/* <div className="text-lg">The timeline is empty.</div>
    <button className="btn mt-3 px-5">Add a new travel</button> */}
    </div>
  )
}

export default Itinerary
