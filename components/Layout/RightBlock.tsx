import React from "react"
import FavoriteCities from "../City/FavoriteCities"

function RightBlock({ places, placeIds, getPlaceFromObject }) {
  console.log("RightBlock placeId",placeIds)
  console.log("RightBlock places",places)
  return (
    <div className=" col-span-1 ml-3 border-l p-2 pl-2">
      <div className="mb-3 text-xl ">Favorite Cities</div>
      <FavoriteCities
        places={places}
        placeIds={placeIds}
        getPlaceFromObject={getPlaceFromObject}
      />
    </div>
  )
}

export default RightBlock
