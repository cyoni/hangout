import { dividerClasses } from "@mui/material"
import React, { useEffect, useState } from "react"
import Avatar from "../components/Avatar"
import HeaderImage from "../components/HeaderImage"
import Message from "../components/Message"
import Spinner from "../components/Spinner"
import { GET_MESSAGES_METHOD } from "../lib/consts"
import { post } from "../lib/postman"

interface IMessage {
  _id: string
  message: string
  timestamp: number
  receiverId: string
  senderId: string
  profile: [{ name: string; place: Place }]
}
function inbox({ connectedUser }) {
  const [messages, setMessages] = useState<IMessage[]>(null)
  useEffect(() => {
    const getMsgs = async () => {
      console.log("getMsgs", connectedUser)
      if (!connectedUser) return
      const body = {
        userId: connectedUser.user.userId,
        jwt: connectedUser.jwt,
        method: GET_MESSAGES_METHOD,
      }
      const result = await post({ url: "api/inboxNotificationsApi", body })
      console.log("msg msg", result.data)
      setMessages(result.data)
    }
    getMsgs()
  }, [connectedUser])
  return (
    <div>
      <HeaderImage title="Messages" />
      {!messages && <Spinner className="mt-20 flex justify-center" />}
      <div className="mt-6 max-w-[80%]">
        {messages?.length > 0 && (
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <Message {...msg} />
              </div>
            ))}
          </div>
        )}
        {messages?.length === 0 && <div>No messages</div>}
      </div>
    </div>
  )
}

export default inbox
