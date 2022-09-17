import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { TextField } from "@mui/material"
import React from "react"
import ButtonIntegration from "../ButtonIntegration"
import CustomAvatar from "../CustomAvatar"
import useSendMessage from "./useSendMessage"

function SendMessage({ name, picture, theirId, closeModal }) {
  const { sendMessage, messageMutation, message, setMessage } =
    useSendMessage(theirId)

  const { isSuccess } = messageMutation

  return (
    <div className="w-full">
      {isSuccess ? (
        <div className="my-16">
          <div className="flex flex-col items-center gap-2">
            <ChatBubbleOvalLeftEllipsisIcon className="h-20 text-green-500" />
            <p className="text-2xl ">Message has been sent</p>
            <button className="btn-outline mt-5" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <CustomAvatar
              userId={theirId}
              picture={picture}
              name={name}
              className="h-16 w-16"
            />
            <div className="text-3xl font-semibold capitalize">{name}</div>
          </div>
          <div className="flex flex-col my-10">
            <TextField
              id="outlined-basic"
              label="Message"
              variant="outlined"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
            />
          </div>
          <ButtonIntegration
            buttonClassName="btn w-fit block ml-auto px-10"
            onClick={sendMessage}
          >
            Send
          </ButtonIntegration>
        </>
      )}
    </div>
  )
}

export default SendMessage
