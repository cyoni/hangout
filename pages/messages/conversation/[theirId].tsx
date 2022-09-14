import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import Back from "../../../components/Back"
import CustomAvatar from "../../../components/CustomAvatar"
import HeaderImage from "../../../components/HeaderImage"
import Refresh from "../../../components/Refresh"
import Spinner from "../../../components/Spinner"
import { getProfiles } from "../../api/profileApi"
import Message from "./Message"
import useConversation from "./useConversation"

function Messages({ theirId, profile, session }) {
  console.log("msgs session", session)

  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef(null)
  const inputRef = useRef()
  const { name, picture } = profile
  const myProfilePic = session?.user?.image
  const myName = session?.user?.name
  const {
    messages,
    handleMessage,
    scrollToBottom,
    handleRefresh,
  } = useConversation({
    theirId,
    messagesEndRef,
    inputRef,
    message,
    setMessage,
  })
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />
      <div className="ml-7 mt-5 flex items-center space-x-2">
        <Back className="" url="/messages" />
        <Refresh
          className=" h-10  w-10 cursor-pointer rounded-full p-2
                   text-gray-400 transition duration-150 hover:rotate-180
                   hover:bg-gray-100"
          onClick={handleRefresh}
        />
      </div>
      <div className="relative mx-auto w-[55%] cursor-default rounded-md border pb-5">
        <div className="flex items-center justify-between  py-3 px-3 shadow-md">
          <div
            onClick={() => window.open(`/profile/${theirId}`)}
            className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer p-1 px-4 rounded-md"
          >
            <CustomAvatar
              className="h-10 w-10"
              name={name}
              disabled
              picture={picture}
            />
            <div className="text-lg font-bold capitalize">{name}</div>
          </div>
          <button className="btn flex items-center justify-between space-x-2 border border-gray-300 bg-white px-4 text-blue-600 hover:bg-gray-200">
            <span>Options</span>
          </button>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <div className="mt-2 flex min-h-[500px] flex-col justify-end rounded-md  p-3">
            {Array.isArray(messages) &&
              messages.map((msg) => (
                <Message key={msg._id} theirId={theirId} data={msg} />
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Send message box */}
        <form className="px-2" onSubmit={(e) => handleMessage(e)}>
          <div className="mt-2 flex space-x-2">
            <CustomAvatar
              disabled
              name={myName}
              picture={myProfilePic}
              className="h-10 w-10"
            />
            <input
              autoFocus
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-14 flex-1 rounded-md border p-2 outline-none"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button className="btn px-7" type="submit">
              Send
            </button>
          </div>
        </form>
        {!messages && (
          <Spinner className="absolute left-1/2 top-1/2 mx-auto inline-block" />
        )}
      </div>
    </div>
  )
}

export default Messages

export async function getServerSideProps(context) {
  const { theirId } = context.params

  const profile = (await getProfiles({ userIds: [theirId] }))?.[0]

  return {
    props: {
      theirId: theirId,
      profile,
    },
  }
}
