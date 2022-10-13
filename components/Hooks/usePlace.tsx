import { useQuery } from "@tanstack/react-query"
import { getPlace } from "../../lib/dbClient"

// @TODO: first check if city was already fetched.
function usePlace(placeIds: string[]) {
  console.log("USE PLACES CITY IDS", placeIds)

  const fetchPlaces = async (placeIds) => {
    console.log("fetchPlaces", placeIds)
    return await getPlace(placeIds)
  }

  const placeQuery = useQuery(
    ["city-data-controller", placeIds],
    async () => await fetchPlaces(placeIds),
    {
      enabled: Array.isArray(placeIds) && placeIds.length > 0,
    }
  )

  const places = placeQuery.data

  const getFirstPlace = (): Place => {
    console.log("placeIds..", placeIds)
    return getPlaceFromObject(placeIds[0])
  }

  const getPlaceFromObject = (id): Place => {
    console.log("getPlaceFromObject", places)
    return places ? { placeId: id, ...places[id] } : null
  }

  return { getFirstPlace, places, getPlaceFromObject, placeQuery }
}

export default usePlace
