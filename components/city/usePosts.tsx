import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { GET_MESSAGES, POST_MESSAGE } from "../../lib/consts"
import { get, post } from "../../lib/postman"
import { isNullOrEmpty } from "../../lib/scripts/strings"

function usePosts(place: Place) {
  const [messageInput, setMessageInput] = useState<string>("")

  const postQuery = useQuery(
    ["city-post-message"],
    async () => {
      return await post({
        url: "/api/cityApi",
        body: {
          method: POST_MESSAGE,
          message: messageInput,
          cityId: place.city_id,
        },
      })
    },
    { enabled: false }
  )

  const getPostsQuery = useQuery(["city-fetch-posts"], async () => {
    return await get(
      "/api/cityApi",
      `method=${GET_MESSAGES}&cityId=${place.city_id}`
    )
  })

  const sendPost = async () => {
    if (isNullOrEmpty(messageInput)) return
    const refreshToast = toast.loading("Posting...")
    await postQuery.refetch()
    setMessageInput("")
    toast.success("Post was successfully posted!", { id: refreshToast })
  }

  return { messageInput, setMessageInput, sendPost, postQuery, getPostsQuery }
}

export default usePosts
