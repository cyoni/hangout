import { useSession } from "next-auth/react"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import HeaderImage from "../../components/HeaderImage"
import Message from "../../components/Message"
import Spinner from "../../components/Spinner"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts"
import { MESSAGES_API } from "../../lib/consts/apis"
import { queryPlacesFromClient } from "../../lib/dbClient"
import { post } from "../../lib/postman"
import { unique } from "../../lib/scripts/arrays"
import {
  isAuthenticated,
  isNotAuthenticated,
  isSessionReady,
} from "../../lib/session"

interface PreviewMessage {
  _id: string
  sharedToken: string
  message: string
  timestamp: number
  receiverId: string
  senderId: string
  profile: [{ name: string; place: Place }]
}
function inbox() {
  const session = useSession()
  const [messages, setMessages] = useState<MessageObj[]>(null)
  const [places, setPlaces] = useState<Place[]>([])
  useEffect(() => {
    const getMsgs = async () => {
      console.log("getMsgs", session)

      const result: MessageObj[] = await post({
        url: MESSAGES_API,
        body: { method: GET_PREVIEW_MESSAGES_METHOD },
      })
      if (Array.isArray(result)) {
        const cities = result.map((r) => r.profile[0].cityId)
        const uniqueCityCodes = unique(cities)
        const places = await queryPlacesFromClient(uniqueCityCodes)
        if (places?.isError) {
          console.log("An error occured while proccessing the request")
        } else {
          setPlaces(places)
          console.log("placesplaces", places)
          console.log("msg msg", result)
          setMessages(result)
        }
      } else setMessages([])
    }
    if (isAuthenticated(session)) getMsgs()
  }, [session])
  return (
    <div>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />
      {!messages && <Spinner className="mt-20 flex justify-center" />}
      <div className="mt-6 max-w-[80%]">
        {messages?.length > 0 && (
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <Message {...msg} places={places} />
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
