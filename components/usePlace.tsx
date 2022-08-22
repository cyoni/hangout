import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { getPlace } from "../lib/dbClient"
import { getObjectKeys } from "../lib/scripts/objects"

function usePlace(cityIds: string[]) {
  const query = useQuery(
    ["city-data-controller"],
    async () => await getPlace(cityIds)
  )

  const places = query.data

  const getFirstPlace = (): Place => {
    console.log("cityIds..", cityIds)
    return getPlaceFromObject(cityIds[0])
  }

  const getPlaceFromObject = (id) => {
    console.log("getPlaceFromObject", places)
    return places ? places[id] : null
  }

  return { getFirstPlace, places, getPlaceFromObject }
}

export default usePlace
