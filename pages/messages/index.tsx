import { useSession } from "next-auth/react"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import HeaderImage from "../../components/HeaderImage"
import PreviewMessage from "../../components/PreviewMessage"
import Refresh from "../../components/Refresh"
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
  const [unreadMsgs, setUnreadMsgs] = useState<string[]>(null)
  const [places, setPlaces] = useState<Place[]>([])

  const handleRefresh = () => {
    setMessages(null)
    getMsgs()
  }

  const getMsgs = async () => {
    const result: MessageObjResponse = await post({
      url: MESSAGES_API,
      body: { method: GET_PREVIEW_MESSAGES_METHOD },
    })

    console.log("getMsgs", result)

    if (Array.isArray(result)) {
      const cities = result.map((r) => r.profile[0]?.cityId)
      const places = await queryPlacesFromClient(cities)
      if (places?.isError) {
        console.log("An error occured while proccessing the request")
      } else {
        setPlaces(places)
        console.log("places##", places)
        console.log("msg msg", result)
        setUnreadMsgs(result.unreadMsgsIds)
        setMessages(result.previewMsgs)
      }
    } else setMessages([])
  }

  useEffect(() => {
    if (isAuthenticated(session)) getMsgs()
  }, [session])
  return (
    <div>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />
      {messages && (
        <Refresh
          className="mt-5 ml-5 h-10 cursor-pointer rounded-full p-2
          text-gray-400 transition duration-150 hover:rotate-180
           hover:bg-gray-100"
          onClick={handleRefresh}
        />
      )}

      {!messages && <Spinner className="mt-20 flex justify-center" />}
      <div className="mt-6 max-w-[80%]">
        {messages?.length > 0 && (
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <PreviewMessage {...msg} places={places} />
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
