import React from "react"

const Message = ({ theirId, data }) => {
  const message = data.message
  const senderId = data.senderId
  // incoming message
  if (senderId === theirId) {
    return (
      <div className="my-2 flex">
        <div
          className="max-w-[800px] rounded-xl border
             bg-blue-600 py-1
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

export default Message
