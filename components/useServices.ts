import { my_following_list } from "./../lib/consts/query"
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { get } from "../lib/postman"
import { GET_FOLLOWING } from "../lib/consts"
import { FollowingQuery } from "../lib/queries"

function useServices() {
  const followService = useQuery([my_following_list], () => FollowingQuery())

  return { followService }
}

export default useServices
