import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import React from "react"
import { GET_CITY_ITINERARIES, GET_USER_ITINERARIES } from "../../lib/consts"
import { TRAVEL_API } from "../../lib/consts/apis"
import { newGet } from "../../lib/postman"

interface Props {
  isCity?: boolean
  placeIds?: number[]
  isUser?: boolean
  userIds?: string[]
}
function useItinerary({ isCity, placeIds: placeIds, isUser, userIds }: Props) {
  const cityItineraryQuery = useInfiniteQuery(
    ["cityItineraryQuery", placeIds],
    async ({ pageParam = 1 }) => {
      return await newGet(TRAVEL_API, {
        method: GET_CITY_ITINERARIES,
        page: pageParam,
        placeIds,
      })
    },
    {
      enabled: !!isCity && !!placeIds,
      getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: Infinity,
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
