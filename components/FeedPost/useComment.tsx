import { useMutation } from "@tanstack/react-query"
import React, { useState } from "react"
import { POST_COMMENT } from "../../lib/consts"
import { CITY_API } from "../../lib/consts/apis"
import { post } from "../../lib/postman"

function useComment(postId) {
  const [message, setMessage] = useState<string>()

  const triggerFollowMutation = (body) => {
    return post({
      url: CITY_API,
      body: { ...body },
    })
  }

  const commentMutation = useMutation(triggerFollowMutation)

  const sendComment = async () => {
    await commentMutation.mutateAsync({
      postId,
      message,
      method: POST_COMMENT,
    })
    setMessage("")
  }

  return { sendComment, commentMutation, message, setMessage }
}

export default useComment
