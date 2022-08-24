import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query"
import React from "react"
import toast from "react-hot-toast"
import { START_FOLLOW, STOP_FOLLOW } from "../lib/consts"
import { my_following_list } from "../lib/consts/query"
import { post } from "../lib/postman"

interface followReq {
  userId: string
  method: string
}
function useFollow() {
  const followers = []

  const followQuery: UseQueryResult<string[], {}> = useQuery([
    my_following_list,
  ])

  const startFollowMutation = (body: followReq) => {
    return post({
      url: "/api/followApi",
      body: { ...body },
    })
  }
  const followMutation = useMutation(startFollowMutation)

  const follow = async (req) => {
    await followMutation.mutateAsync({
      userId: req.userId,
      method: START_FOLLOW,
    })
    toast.success("New following!")
  }

  const unFollow = async (req) => {
    await followMutation.mutateAsync({
      userId: req.userId,
      method: STOP_FOLLOW,
    })
    toast.success(`You stopped following ${req.name}`)
  }

  const isFollowing = (id: string) => {
    console.log("followQuery.data", followQuery.data)
    return followQuery?.data?.some((userId) => userId === id)
  }

  const refreshFollowings = () => {
    followQuery.refetch()
  }

  return {
    follow,
    unFollow,
    followMutation,
    followQuery,
    followers,
    isFollowing,
    refreshFollowings,
  }
}

export default useFollow
