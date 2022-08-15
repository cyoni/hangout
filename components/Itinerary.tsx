import React from "react"
import TravelTimeLine from "./TravelTimeLine"

function Itinerary() {
  return (
    <div className=" justify-evenly mt-2 min-h-[200px] rounded-md  border p-2">
      <div className="flex">
        <button className="btn-outline border ml-auto h-8 rounded-md">
          Edit Itinerary
        </button>
      </div>
      <div className="flex flex-row-reverse	 justify-between">
        <div className="p-2 text-lg rounded-md basis-[65%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis,
          similique repellat. Consequuntur, consectetur! Aperiam repudiandae
          nobis quasi sint recusandae labore doloremque iusto harum fuga quo
          rerum excepturi, temporibus deleniti necessitatibus. Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Perspiciatis, similique
          repellat. Consequuntur, consectetur! Aperiam repudiandae nobis quasi
          sint recusandae labore doloremque iusto harum fuga quo rerum
          excepturi, temporibus deleniti necessitatibus. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Perspiciatis, similique repellat.
          Consequuntur, consectetur! Aperiam repudiandae nobis quasi sint
          recusandae labore doloremque iusto harum fuga quo rerum excepturi,
          temporibus deleniti necessitatibus. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Perspiciatis, similique repellat.
          Consequuntur, consectetur! Aperiam repudiandae nobis quasi sint
          recusandae labore doloremque iusto harum fuga quo rerum excepturi,
          temporibus deleniti necessitatibus.
        </div>
        <div className="border-l "></div>
        <TravelTimeLine />
      </div>
      {/* <div className="text-lg">The timeline is empty.</div>
    <button className="btn mt-3 px-5">Add a new travel</button> */}
    </div>
  )
}

export default Itinerary
