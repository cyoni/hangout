import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { GET_MESSAGES, POST_MESSAGE } from "../../lib/consts"
import { CITY_API } from "../../lib/consts/apis"
import { CITY_POST_MESSAGE } from "../../lib/consts/query"
import { get, newGet, post } from "../../lib/postman"
import { isNullOrEmpty } from "../../lib/scripts/strings"

function usePosts(place: Place) {
  const [messageInput, setMessageInput] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

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
    newGet(CITY_API, {
      method: GET_MESSAGES,
      cityId: place.city_id,
      page: pageParam,
    })

  const postsQuery = useQuery(
    ["city-fetch-posts", page],
    () => fetchPosts(page),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      // getNextPageParam: (lastPage, allPages) => lastPage.data.nextPage,
      // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      onSuccess: (data) => {
        setTotalPages(data.totalPages)
      },
    }
  )

  console.log("totalPages", totalPages)

  const sendPost = async () => {
    if (isNullOrEmpty("messageInput")) return
    const refreshToast = toast.loading("Posting...")
    await sendPostMutation.mutateAsync()
    setMessageInput("")
    toast.success("Your post is live!", { id: refreshToast })
    postsQuery.refetch()
  }

  const pages = postsQuery.data?.posts

  console.log("pages", pages)

  const noContent =
    !postsQuery.isFetching &&
    Array.isArray(pages) &&
    pages.length > 0 &&
    pages[0].posts?.length === 0

  return {
    sendPost,
    postsQuery,
    messageInput,
    setMessageInput,
    pages,
    noContent,
    page,
    setPage,
    totalPages,
  }
}

export default usePosts
