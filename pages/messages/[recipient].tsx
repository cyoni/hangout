import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import Avatar from "../../components/Avatar"
import Back from "../../components/Back"
import HeaderImage from "../../components/HeaderImage"
import { post } from "../../lib/postman"

function Messages() {
  useEffect(() => {
    await get({url: "/api/getMessages"})
  }, [])

  const router = useRouter()
  const { recipient } = router.query
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState<string>("")
  const inputRef = useRef()

  const handleMessage = async (e) => {
    e.preventDefault()
    if (!input) return
    const newMessage = { message: input, isIncoming: false }
    const result = await post({
      url: "/api/sendMessage",
      body: { receiverId: recipient, message: input },
    })
    console.log("msg result", result)

    /// setMessages([...messages, newMessage])
    setInput("")
    inputRef.current.focus()
  }
  console.log("messages", messages)
  const Msg = ({ message }) => {
    return (
      <div className="my-2 flex">
        <div className="max-w-[800px]  rounded-xl border bg-blue-700 py-1 px-3 text-white shadow-md">
          {message}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />
      <Back className="ml-7 mt-5" url="/messages" />
      <div className="mx-auto w-[70%] cursor-default rounded-md border px-5 pb-5">
        <div className="my-4 flex items-center space-x-1">
          <Avatar className="h-10 w-10" />
          <div className="text-lg font-bold">Yoni</div>
        </div>
        <div className="mt-2 flex h-[500px] flex-col  justify-end overflow-y-scroll rounded-md border p-2">
          {messages &&
            messages.map((message, i) => (
              <Msg key={i} message={message.message} />
            ))}
        </div>
        {/* Send message box */}
        <form onSubmit={(e) => handleMessage(e)}>
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
      </div>
    </div>
  )
}

export default Messages
