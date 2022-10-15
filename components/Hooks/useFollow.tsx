import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query"
import  { useState } from "react"
import toast from "react-hot-toast"
import { START_FOLLOW, STOP_FOLLOW } from "../../lib/consts"
import { my_following_list } from "../../lib/consts/query"
import { post } from "../../lib/postman"
import { FollowingQuery } from "../../lib/queries"

interface followReq {
  userId?: string
  placeId?: number
  method: string
  type: "FOLLOW" | "CITY"
}
function useFollow(initialData = null) {
  const followers = []
  const [tmpFollowing, setTmpFollowing] = useState([])
  console.log("initialData", initialData)

  const getOptions = () => {
    const options: { enabled: boolean; staleTime: number; initialData?: {} } = {
      enabled: true,
      staleTime: 900000,
    }
    if (initialData) options.initialData = initialData
    return options
  }

  const followQuery: UseQueryResult<MyFollowing, {}> = useQuery(
    [my_following_list, null],
    async () => await FollowingQuery(null),
    getOptions()
  )

  const triggerFollowMutation = (body: followReq) => {
    return post({
      url: "/api/followApi",
      body: { ...body },
    })
  }
  const followMutation = useMutation(triggerFollowMutation)

  const follow = async (req) => {
    const { name, userId, placeId, type } = req
    await followMutation.mutateAsync(
      {
        userId: userId,
        placeId: placeId,
        method: START_FOLLOW,
        type: type,
      },
      {
        onSuccess: () => {
          toast.success(`You started Following ${name}`)
          setTmpFollowing([...tmpFollowing, userId])
        },
      }
    )
  }

  const unFollow = async (req) => {
    const { name, userId, placeId, type } = req
    await followMutation.mutateAsync(
      {
        userId: userId,
        placeId: placeId,
        method: STOP_FOLLOW,
        type: type,
      },
      {
        onSuccess: () => {
          toast.success(`You stopped following ${name}`)
          setTmpFollowing([tmpFollowing.filter((userId) => userId !== userId)])
        },
      }
    )
  }

  const isFollowing = (id: string) => {
    console.log("followQuery.data", followQuery.data)
    console.log("isFollowing", tmpFollowing)
    return (
      tmpFollowing.some((userId) => userId === String(id)) ||
      followQuery.data?.members?.some(
        (member) => member.userId == String(id)
      ) ||
      followQuery.data?.cities?.[0]?.placeIds?.some(
        (placeId) => placeId === id
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
