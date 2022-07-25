import { dividerClasses } from "@mui/material"
import { getToken } from "next-auth/jwt"
import { getSession, signIn, useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import Avatar from "../components/Avatar"
import HeaderImage from "../components/HeaderImage"
import Message from "../components/Message"
import Spinner from "../components/Spinner"
import { GET_MESSAGES_METHOD } from "../lib/consts"
import { post } from "../lib/postman"
import {
  isAuthenticated,
  isNotAuthenticated,
  isSessionReady,
} from "../lib/session"

interface IMessage {
  _id: string
  message: string
  timestamp: number
  receiverId: string
  senderId: string
  profile: [{ name: string; place: Place }]
}
function inbox() {
  const session = useSession()
  const [messages, setMessages] = useState<MessageObj[]>(null)
  useEffect(() => {
    const getMsgs = async () => {
      console.log("getMsgs", session)
      const body = {
        method: GET_MESSAGES_METHOD,
      }
      const result: MessageObj[] = await post({
        url: "api/inboxNotificationsApi",
        body,
      })
      console.log("msg msg", result)
      setMessages(result)
    }
    if (isAuthenticated(session)) getMsgs()
  }, [session])
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

// export async function getServerSideProps(context) {
//   const token = await getToken(context)
//   if (token){

//   }
//   return { props: {name: "d"}}
// }
