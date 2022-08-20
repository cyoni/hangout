import React, { useEffect, useState } from "react"
import { getPlace } from "../lib/dbClient"

function usePlaces(cityIds) {
  const [places, setPlaces] = useState<Place[]>(null)

  useEffect(() => {
    console.log("usePlaces: got city id: ", cityIds)
    const getCities = async () => {
      const cityArray =
        cityIds instanceof String ? cityIds.split(",") : [cityIds]
      console.log("cityArray", cityArray)
      const places = await getPlace(cityArray)
      console.log("places ans", places)
      if (!places.error) setPlaces(null)
      setPlaces(places)
    }
    getCities()
  }, [cityIds])

  const getPlaceFromObject = (id) => {
    return places ? places[id] : null
  }

  return { places, getPlaceFromObject }
}

export default usePlaces
