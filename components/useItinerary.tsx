import { useQuery } from "@tanstack/react-query"
import React from "react"
import { GET_CITY_ITINERARIES, GET_USER_ITINERARIES } from "../lib/consts"
import { TRAVEL_API } from "../lib/consts/apis"
import { newGet } from "../lib/postman"

interface Props {
  isCity?: boolean
  cityIds?: number[]
  isUser?: boolean
  userIds?: string[]
}
function useItinerary({ isCity, cityIds, isUser, userIds }: Props) {
  const cityItineraryQuery = useQuery(
    ["cityItineraryQuery", cityIds],
    async () => {
      return await newGet(TRAVEL_API, { method: GET_CITY_ITINERARIES, cityIds })
    },
    {
      enabled: !!isCity && !!cityIds,
    }
  )

  const userItineraryQuery = useQuery(
    ["userItineraryQuery", userIds],
    async () => {
      return await newGet(TRAVEL_API, { method: GET_USER_ITINERARIES, userIds })
    },
    {
      enabled: !!isUser && !!userIds,
    }
  )

  return { cityItineraryQuery, userItineraryQuery }
}

export default useItinerary
