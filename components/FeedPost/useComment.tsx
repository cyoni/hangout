import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { GET_POST_COMMENTS, POST_COMMENT } from "../../lib/consts"
import { CITY_API } from "../../lib/consts/apis"
import { get, newGet, post } from "../../lib/postman"
import { POST_COMMENTS_KEY } from "../../lib/queries"

function useComment(postId) {
  const [message, setMessage] = useState<string>("")
  const [totalComments, setTotalComments] = useState<number>(null)

  const commentQuery = useInfiniteQuery(
    [POST_COMMENTS_KEY, postId],
    async ({ pageParam = 1 }) => {
      return newGet(CITY_API, {
        method: GET_POST_COMMENTS,
        page: pageParam,
        postId,
      })
    },
    {
      getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: Infinity,
      onSuccess: (data) => {
        setTotalComments(data.pages[data.pages.length - 1]?.totalComments)
      },
    }
  )

  const triggerCommentMutation = (body) => {
    return post({
      url: CITY_API,
      body: { ...body },
    })
  }

  const commentMutation = useMutation(triggerCommentMutation)

  const sendComment = async () => {
    try {
      await commentMutation.mutateAsync({
        postId,
        message,
        method: POST_COMMENT,
      })
    } catch (e) {}
    setMessage("")
  }

  return {
    commentQuery,
    sendComment,
    commentMutation,
    message,
    setMessage,
    totalComments,
  }
}

export default useComment
