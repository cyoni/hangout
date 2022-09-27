import { useMutation, useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  SEND_MESSAGE_API,
  SEND_MESSAGE_METHOD,
} from "../../lib/consts"
import { post } from "../../lib/postman"
import randomString from "../../lib/randomString"
import { isNullOrEmpty } from "../../lib/scripts/strings"

function useConversation({
  theirId,
  message,
  setMessage,
  messagesEndRef,
  inputRef,
}) {
  const [messages, setMessages] = useState(null)
  const [sentMessages, setSentMessages] = useState<string[]>([])

  useEffect(() => {
    console.log("sentMessages", sentMessages)
    sentMessages.forEach((sendMessage) => {
      try {
        const messageThatWasSent = messages.filter(
          (x) => x.id === sendMessage
        )[0]
        console.log("UNIQEW CODE", sendMessage)
        console.log("messageThatWasSent", messageThatWasSent)
        messageThatWasSent.status = "SENT"
        const updatedData = messages.filter((x) => x.id !== sendMessage)
        updatedData.push(messageThatWasSent)
        setMessages(updatedData)
      } catch (e) {}
    })
  }, [sentMessages])

  const messageFetcherQuery = useQuery(
    ["chat-messages-query"],
    async () => {
      return await post({
        url: "/api/messagesApi",
        body: {
          method: GET_ALL_MESSAGES_BY_USER_METHOD,
          theirId: theirId,
        },
      })
    },
    {
      enabled: !!theirId,
      refetchInterval: 6000,
      onSuccess: (data) => {
        setMessages(data)
      },
    }
  )

  const triggerCommentMutation = (body) => {
    return post({
      url: SEND_MESSAGE_API,
      body: {
        method: SEND_MESSAGE_METHOD,
        theirId: body.theirId,
        message: body.input,
      },
    })
  }

  const commentMutation = useMutation(triggerCommentMutation)

  const handleMessage = async (e) => {
    e.preventDefault()

    if (isNullOrEmpty(message)) return

    const msgId = randomString(5)
    const newMessage = { message, id: msgId, status: "SENDING" }

    setMessages([...messages, newMessage])
    scrollToBottom()
    setMessage("")
    inputRef.current.focus()

    try {
      await commentMutation.mutateAsync(
        {
          input: message,
          msgId,
          theirId,
        },
        {
          onSuccess: (data) => {
            setSentMessages([...sentMessages, msgId])
          },
        }
      )
    } catch (e) {}
    setMessage("")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleRefresh = () => {
    setMessages(null)
    messageFetcherQuery.refetch()
  }

  return {
    messageFetcherQuery,
    handleMessage,
    messages,
    scrollToBottom,
    handleRefresh,
  }
}

export default useConversation
