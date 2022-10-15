import { useMutation, useQuery } from "@tanstack/react-query"
import  { useState } from "react"
import toast from "react-hot-toast"
import { GET_MESSAGES, POST_MESSAGE } from "../../lib/consts"
import { CITY_API } from "../../lib/consts/apis"
import {  get, post } from "../../lib/postman"
import { isNullOrEmpty } from "../../lib/scripts/strings"

interface Props {
  placeId?: number
  followingPosts?: boolean
  take?: number
}
function usePosts({ placeId, followingPosts, take }: Props) {
  const [messageInput, setMessageInput] = useState<string>("")
  const [page, setPage] = useState<number>(1)

  const postsQuery = useQuery(
    ["city-fetch-posts", placeId, followingPosts, page],
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
      enabled: !!placeId || !!followingPosts,
    }
  )

  const [totalPages, setTotalPages] = useState<number>(
    postsQuery?.data?.totalPages || 0
  )

  const sendPostMutation = useMutation(() =>
    post({
      url: "/api/cityApi",
      body: {
        method: POST_MESSAGE,
        message: messageInput,
        placeId,
      },
    })
  )

  const fetchPosts = (pageParam: number) =>
    get(CITY_API, {
      method: GET_MESSAGES,
      placeId,
      followingPosts,
      page: pageParam,
      take,
    })

  console.log("totalPages", totalPages)

  const sendPost = async () => {
    if (isNullOrEmpty(messageInput)) {
      toast.error("Post can't be empty")
      return
    }
    const refreshToast = toast.loading("Posting...")
    await sendPostMutation.mutateAsync()
    setMessageInput("")
    toast.success("Your post is live!", { id: refreshToast })
    postsQuery.refetch()
  }

  const pages = postsQuery.data?.posts

  console.log("pages", pages)

  const noContent =
    (!postsQuery.isFetching && Array.isArray(pages) && pages.length == 0) ||
    !pages

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
