import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  GET_POST_COMMENTS,
  POST_COMMENT,
  POST_COMMENTS_KEY,
} from "../../lib/consts/consts"
import { CITY_API } from "../../lib/consts/apis"
import { get, post } from "../../lib/postman"

function useComment(postId) {
  const [message, setMessage] = useState<string>("")

  const commentQuery = useInfiniteQuery(
    [POST_COMMENTS_KEY, postId],
    async ({ pageParam = 1 }) => {
      return get(CITY_API, {
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
    }
  )

  const totalComments =
    commentQuery.isSuccess &&
    commentQuery.data.pages[commentQuery.data.pages.length - 1]?.totalComments

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
