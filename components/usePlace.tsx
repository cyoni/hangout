import { arrayIncludes } from "@mui/x-date-pickers/internals/utils/utils"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { getPlace } from "../lib/dbClient"
import { getObjectKeys } from "../lib/scripts/objects"

function usePlace(cityIds: string[]) {
  const fetchPlaces = async (cityIds) => {
    console.log("fetchPlaces", cityIds)
    return await getPlace(cityIds)
  }

  const query = useQuery(
    ["city-data-controller", cityIds],
    async () => await fetchPlaces(cityIds),
    {
      enabled: !!Array.isArray(cityIds),
    }
  )

  const places = query.data

  const getFirstPlace = (): Place => {
    console.log("cityIds..", cityIds)
    return getPlaceFromObject(cityIds[0])
  }

  const getPlaceFromObject = (id): Place => {
    console.log("getPlaceFromObject", places)
    return places ? { city_id: id, ...places[id] } : null
  }

  return { getFirstPlace, places, getPlaceFromObject }
}

export default usePlace
