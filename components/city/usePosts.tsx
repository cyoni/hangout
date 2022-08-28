import { useMutation, useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { GET_MESSAGES, POST_MESSAGE } from "../../lib/consts"
import { CITY_POST_MESSAGE } from "../../lib/consts/query"
import { get, post } from "../../lib/postman"
import { isNullOrEmpty } from "../../lib/scripts/strings"

function usePosts(place: Place) {
  const [messageInput, setMessageInput] = useState<string>("")
  const [pointer, setPointer] = useState<number>(0)

  const sendPostMutation = useMutation(() =>
    post({
      url: "/api/cityApi",
      body: {
        method: POST_MESSAGE,
        message: messageInput,
        cityId: place.city_id,
      },
    })
  )


  const getPostsQuery = useQuery(
    ["city-fetch-posts", pointer],
    async () => {
      return await get(
        "/api/cityApi",
        `method=${GET_MESSAGES}&cityId=${place.city_id}&page=${pointer}`
      )
    },
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
   
    }
  )

  const sendPost = async () => {
    if (isNullOrEmpty("messageInput")) return
    const refreshToast = toast.loading("Posting...")
    await sendPostMutation.mutateAsync()
    setMessageInput("")
    toast.success("Your post is live!", { id: refreshToast })
    getPostsQuery.refetch()
  }

  const bringMore = () => {
    const posts:Post[] = getPostsQuery.data.data
    console.log("posts",posts)
    const takeFrom = posts[posts.length - 1].timestamp
    console.log("takeFrom", takeFrom)
    setPointer(takeFrom)
  }

  return {
    sendPost,
    getPostsQuery,
    messageInput,
    setMessageInput,
    bringMore
  }
}

export default usePosts
