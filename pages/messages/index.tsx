import { getSession, useSession } from "next-auth/react"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import HeaderImage from "../../components/Header/HeaderImage"
import PreviewMessage from "../../components/Chat/PreviewMessage"
import Refresh from "../../components/Buttons/Refresh"
import Spinner from "../../components/Loaders/Spinner"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts/consts"
import { MESSAGES_API } from "../../lib/consts/apis"
import { queryPlacesFromClient } from "../../lib/dbClient"
import { post } from "../../lib/postman"
import { checkUser, isAuthenticated } from "../../lib/scripts/session"

interface PreviewMessage {
  _id: string
  sharedToken: string
  message: string
  timestamp: number
  receiverId: string
  senderId: string
  profile: [{ name: string; place: Place }]
}
export default function Inbox() {
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

    if (Array.isArray(result?.previewMsgs)) {
      const cities = result.previewMsgs.map((r) => r.profile[0]?.placeId)
      const places = await queryPlacesFromClient(cities)
      if (places) {
        setPlaces(places)
        setUnreadMsgs(result.unreadMsgsIds)
        setMessages(result.previewMsgs)
      }
    } else setMessages([])
  }

  useEffect(() => {
    if (isAuthenticated(session)) getMsgs()
  }, [session])
  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />
      <div className="mx-auto mt-6 min-h-[500px] xl:max-w-[1300px]">
        <>
          {messages && (
            <Refresh
              className="mt-5 ml-5 mb-10 h-10 w-10 cursor-pointer rounded-full p-2
          text-gray-400 transition duration-150 hover:rotate-180
           hover:bg-gray-100"
              onClick={handleRefresh}
            />
          )}
          {console.log("messages", messages)}
          {!messages && <Spinner className="mt-20 flex justify-center" />}

          {Array.isArray(messages) && (
            <>
              {messages.map((msg) => (
                <div key={msg._id}>
                  <PreviewMessage {...msg} places={places} />
                </div>
              ))}
            </>
          )}
          {messages?.length === 0 && (
            <div className="text-center text-3xl">No messages</div>
          )}
        </>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  console.log("session",session)
  const checkUserRes = checkUser(context, session)
  if (checkUserRes.redirect) return checkUserRes
  return { props: {} }
}
