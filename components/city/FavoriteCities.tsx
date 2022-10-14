import React from "react"
import generateRandomString from "../../lib/scripts/strings"

function FavoriteCities({ places, placeIds, getPlaceFromObject }) {
  return (
    <div>
      {places &&
        placeIds &&
        placeIds.map((city) => {
          const place = getPlaceFromObject(city)
          return (
            <a key={generateRandomString(3)} href={`/city/${place?.cityId}`}>
              <div className="p-2 rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 hover:text-blue-500">
                {place?.city}
              </div>
            </a>
          )
        })}
    </div>
  )
}

export default FavoriteCities
