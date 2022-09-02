import { useMutation } from "@tanstack/react-query"
import React, { useState } from "react"
import { SEND_MESSAGE_METHOD } from "../../lib/consts"
import { MESSAGES_API } from "../../lib/consts/apis"
import { post } from "../../lib/postman"

function useSendMessage(theirId: string) {
  const [message, setMessage] = useState<string>()

  const triggerFollowMutation = (body) => {
    return post({
      url: MESSAGES_API,
      body: { ...body },
    })
  }

  const messageMutation = useMutation(triggerFollowMutation)

  const sendMessage = async () => {
    await messageMutation.mutateAsync({
      theirId,
      message,
      method: SEND_MESSAGE_METHOD,
    })
    setMessage("")
  }

  return { sendMessage, messageMutation, message, setMessage }
}

export default useSendMessage
