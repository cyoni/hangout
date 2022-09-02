import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline"
import { TextField } from "@mui/material"
import React from "react"
import ButtonIntegration from "../ButtonIntegration"
import useSendMessage from "./useSendMessage"

function SendMessage({ name, theirId, closeModal }) {
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
        <div>
          <div className="text-3xl">Send Message To {name}</div>
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
          <ButtonIntegration buttonClassName="btn" onClick={sendMessage}>
            Send Message
          </ButtonIntegration>
        </div>
      )}
    </div>
  )
}

export default SendMessage
