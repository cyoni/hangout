import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query"
import React from "react"
import toast from "react-hot-toast"
import { START_FOLLOW, STOP_FOLLOW } from "../lib/consts"
import { my_following_list } from "../lib/consts/query"
import { post } from "../lib/postman"
import { FollowingQuery } from "../lib/queries"

interface followReq {
  userId?: string
  cityId?: number
  method: string
  type: "FOLLOW" | "CITY"
}
function useFollow(initialData = null) {
  const followers = []
  console.log("initialData",initialData)
  
  const followQuery: UseQueryResult<MyFollowing, {}> = useQuery(
    [my_following_list, null],
    async () => await FollowingQuery(null),
    {
      enabled: true,
      staleTime: 30000,
      initialData: initialData,
    }
  )

  const triggerFollowMutation = (body: followReq) => {
    return post({
      url: "/api/followApi",
      body: { ...body },
    })
  }
  const followMutation = useMutation(triggerFollowMutation)

  const follow = async (req) => {
    await followMutation.mutateAsync({
      userId: req.userId,
      cityId: req.cityId,
      method: START_FOLLOW,
      type: req.type,
    })
    toast.success(`You started following ${req.name}`)
  }

  const unFollow = async (req) => {
    await followMutation.mutateAsync({
      userId: req.userId,
      cityId: req.cityId,
      method: STOP_FOLLOW,
      type: req.type,
    })
    toast.success(`You stopped following ${req.name}`)
  }

  const isFollowing = (id: string | number) => {
    console.log("followQuery.data", followQuery.data)

    return (
      followQuery.data?.members?.some(
        (member) => member.userId == String(id)
      ) ||
      followQuery.data?.cities?.[0]?.cityIds?.some(
        (cityId) => cityId === Number(id)
      )
    )
  }

  const getMyFollowingList = () => {
    followQuery.refetch()
  }

  return {
    follow,
    unFollow,
    followMutation,
    followQuery,
    followers,
    isFollowing,
    getMyFollowingList,
  }
}

export default useFollow
