import React from "react"
import generateRandomString from "../../lib/scripts/strings"

function FavoriteCities({ places, placeIds, getPlaceFromObject }) {
  console.log("favoriteCitiesplaces",places)
  return (
    <>
      {places &&
        placeIds &&
        placeIds.map((city) => {
          const place = getPlaceFromObject(city)
          return (
            <a key={generateRandomString(3)} href={`/city/${place?.cityId}`}>
              <div className="cursor-pointer rounded-md p-2 hover:border-gray-300 hover:bg-gray-100 hover:text-blue-500">
                {place?.city}
              </div>
            </a>
          )
        })}
    </>
  )
}

export default FavoriteCities
