import { useQuery } from "@tanstack/react-query"
import { getPlace } from "../../lib/dbClient"

// @TODO: first check if city was already fetched.
function usePlace(cityIds: number[]) {
  console.log("USE PLACES CITY IDS", cityIds)

  const fetchPlaces = async (cityIds) => {
    console.log("fetchPlaces", cityIds)
    return await getPlace(cityIds)
  }

  const placeQuery = useQuery(
    ["city-data-controller", cityIds],
    async () => await fetchPlaces(cityIds),
    {
      enabled: !!Array.isArray(cityIds) && cityIds.length > 0,
    }
  )

  const places = placeQuery.data

  const getFirstPlace = (): Place => {
    console.log("cityIds..", cityIds)
    return getPlaceFromObject(cityIds[0])
  }

  const getPlaceFromObject = (id): Place => {
    console.log("getPlaceFromObject", places)
    return places ? { city_id: id, ...places[id] } : null
  }

  return { getFirstPlace, places, getPlaceFromObject, placeQuery }
}

export default usePlace
