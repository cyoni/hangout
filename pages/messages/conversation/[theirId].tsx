import { Button, Menu, MenuItem } from "@mui/material"
import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import CustomAvatar from "../../../components/Avatar/CustomAvatar"
import HeaderImage from "../../../components/Header/HeaderImage"
import { getProfiles } from "../../api/profileApi"
import useConversation from "../../../components/Hooks/useConversation"
import Spinner from "../../../components/Loaders/Spinner"
import Message from "../../../components/Chat/Message"

function Messages({ theirId, profile, session }) {
  console.log("msgs session", session)

  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef(null)
  const inputRef = useRef()
  const { name, picture } = profile
  const myProfilePic = session?.user?.image
  const myName = session?.user?.name
  const { messages, handleMessage, scrollToBottom, handleRefresh } =
    useConversation({
      theirId,
      messagesEndRef,
      inputRef,
      message,
      setMessage,
    })
  useEffect(() => {
    scrollToBottom()
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Head>
        <title>Messages</title>
      </Head>
      <HeaderImage title="Messages" />

      <div className="relative mx-auto mt-10 cursor-default rounded-md border pb-5 lg:w-[80%] xl:w-[55%]">
        <div className="flex items-center justify-between  py-3 px-3 shadow-md">
          <div
            onClick={() => window.open(`/profile/${theirId}`)}
            className="flex cursor-pointer items-center space-x-2 rounded-md p-1 px-4 hover:bg-gray-100"
          >
            <CustomAvatar
              className="h-10 w-10"
              name={name}
              disabled
              picture={picture}
            />
            <div className="text-lg font-bold capitalize">{name}</div>
          </div>

          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Options
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Delete Chat</MenuItem>
            <MenuItem onClick={handleClose}>Report</MenuItem>
          </Menu>
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
