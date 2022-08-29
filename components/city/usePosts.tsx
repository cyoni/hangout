import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
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

  const fetchPosts = (pageParam: number) =>
    get(
      "/api/cityApi",
      `method=${GET_MESSAGES}&cityId=${place.city_id}&page=${pageParam}`
    )

  const getPostsQuery = useInfiniteQuery(
    ["city-fetch-posts"],
    ({ pageParam = 1 }) => fetchPosts(pageParam),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      ///keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => lastPage.data.nextPage,
      // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
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

  return {
    sendPost,
    getPostsQuery,
    messageInput,
    setMessageInput,
  }
}

export default usePosts
