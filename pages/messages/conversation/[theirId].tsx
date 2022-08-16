import { DotsCircleHorizontalIcon } from "@heroicons/react/outline"
import { useQuery } from "@tanstack/react-query"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { createRef, useEffect, useRef, useState } from "react"
import Avatar from "../../../components/Avatar"
import Back from "../../../components/Back"
import HeaderImage from "../../../components/HeaderImage"
import Refresh from "../../../components/Refresh"
import Spinner from "../../../components/Spinner"
import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  SEND_MESSAGE_API,
  SEND_MESSAGE_METHOD,
} from "../../../lib/consts"
import { PROFILE_API } from "../../../lib/consts/apis"
import { getProfile } from "../../../lib/dbClient"
import { post } from "../../../lib/postman"
import randomString from "../../../lib/randomString"

function Messages({ theirId }) {

  const [messages, setMessages] = useState(null)
  const [input, setInput] = useState<string>("")
  const [profile, setProfile] = useState<Profile>(null)

  useEffect(() => {
    const profile = async () => {
      console.log("their id profile", theirId)
      const profiles = await getProfile([theirId])
      console.log("profile result", profiles)
      if (Array.isArray(profiles) && profiles.length > 0)
        setProfile(profiles[0])
    }
    if (theirId) profile()
  }, [theirId])

  const { isLoading, data, isError, error, isFetching } = useQuery(
    ["get-chat-messages"],
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
      refetchInterval: 6000,
    }
  )

  useEffect(() => {
    setMessages(data)
  }, [data])

  const getMessages = async () => {
    console.log("getting messages....")
    const messages = await post({
      url: "/api/messagesApi",
      body: {
        method: GET_ALL_MESSAGES_BY_USER_METHOD,
        theirId: theirId,
      },
    })
    console.log("messages", messages)
    setMessages(messages)
  }

  // useEffect(() => {
  //   if (theirId) getMessages()
  // }, [theirId])

  const inputRef = useRef()

  const handleMessage = async (e) => {
    e.preventDefault()

    if (!input) return

    const msgId = randomString(5)
    const newMessage = { message: input, id: msgId, status: "SENDING" }
    const newMsgs = [...messages, newMessage]

    setMessages(newMsgs)
    setInput("")
    inputRef.current.focus()

    const result = await post({
      url: SEND_MESSAGE_API,
      body: {
        method: SEND_MESSAGE_METHOD,
        theirId: theirId,
        message: input,
      },
    })
    console.log("msg result", result)
  }

  const Msg = ({ data }) => {
    const message = data.message
    const senderId = data.senderId
    // incoming message
    if (senderId === theirId) {
      return (
        <div className="my-2 flex">
          <div
            className="max-w-[800px] rounded-xl border
             bg-blue-700 py-1
              px-3 text-white shadow-md"
          >
            {message}
          </div>
        </div>
      )
    } else {
      return (
        <div className="my-2 flex justify-end">
          <div
            className={`max-w-[800px] rounded-xl border
           ${data.status === "SENDING" ? "bg-green-400" : "bg-green-600"} py-1
            px-3 text-white shadow-md`}
          >
            {message}
          </div>
        </div>
      )
    }
  }

  const handleRefresh = () => {
    setMessages(null)
    getMessages()
  }

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
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
          className=" h-10 cursor-pointer rounded-full p-2
                   text-gray-400 transition duration-150 hover:rotate-180
                   hover:bg-gray-100"
          onClick={handleRefresh}
        />
      </div>
      <div className="relative mx-auto w-[55%] cursor-default rounded-md border pb-5">
        <div className="flex items-center justify-between  py-4 px-3 shadow-md">
          <div className="flex items-center space-x-1">
            <a href={`/profile/${theirId}`}>
              <Avatar className="h-10 w-10" picture={profile?.picture} />
            </a>
            <div className="text-lg font-bold capitalize">{profile?.name}</div>
          </div>
          <div>
            <button className="btn flex items-center justify-between space-x-2 border border-gray-300 bg-white px-4 text-blue-600 hover:bg-gray-200">
              <DotsCircleHorizontalIcon className="h-6" /> <span>Options</span>
            </button>
          </div>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <div className="mt-2 flex min-h-[500px] flex-col justify-end rounded-md  p-3">
            {console.log("messagesmessages", messages)}
            {Array.isArray(messages) &&
              messages.map((msg) => <Msg key={msg._id} data={msg} />)}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Send message box */}
        <form className="px-2" onSubmit={(e) => handleMessage(e)}>
          <div className="mt-2 flex space-x-2">
            <Avatar className="h-10 w-10" />
            <input
              autoFocus
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
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

  return {
    props: {
      theirId: theirId,
    },
  }
}
