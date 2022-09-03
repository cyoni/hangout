import React, { useState } from "react"
import ModalWrapper from "./ModalWrapper"
import SendMessage from "./SendMessage/SendMessage"

function ChatModal({ userId, name, isModalMessageOpen, setIsModalMessageOpen }) {

  return (
    <ModalWrapper
      height={"h-[52%]"}
      width={"w-[40%]"}
      isOpen={isModalMessageOpen}
      onRequestClose={() => setIsModalMessageOpen(false)}
    >
      <div className="flex justify-center px-10 mt-5 ">
        <SendMessage
          theirId={userId}
          name={name}
          closeModal={() => setIsModalMessageOpen(false)}
        />
      </div>
    </ModalWrapper>
  )
}

export default ChatModal
