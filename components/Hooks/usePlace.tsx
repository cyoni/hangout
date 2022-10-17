import { useQuery } from "@tanstack/react-query"
import { getPlace } from "../../lib/dbClient"

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

  const getPlaceFromObject = (placeId:string): Place => {
    // receives a placeId and returns a place, including a cityID
    console.log("getPlaceFromObject", places)
    console.log("get places. id:", placeId)
    return places ? { placeId, ...places[placeId] } : null
  }

  return { getFirstPlace, places, getPlaceFromObject, placeQuery }
}

export default usePlace
