import { useMutation, useQuery } from "@tanstack/react-query"
import React from "react"
import toast from "react-hot-toast"
import { START_FOLLOW } from "../lib/consts"
import { post } from "../lib/postman"

interface followReq {
  userId: string
  method: string
}
function useFollow() {
  const startFollowMutation = (body: followReq) => {
    return post({
      url: "/api/followApi",
      body: { method: START_FOLLOW, ...body },
    })
  }
  const followMutation = useMutation(startFollowMutation)

  const follow = async (req) => {
    await followMutation.mutateAsync(req)
    toast.success("Great!")
  }

  return { follow, followMutation }
}

export default useFollow
