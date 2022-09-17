import React, { useState } from "react"
import { Profile } from "../pages/typings/typings"
import ModalWrapper from "./ModalWrapper"
import SendMessage from "./SendMessage/SendMessage"

interface Props {
  profile: Profile
  isModalMessageOpen: boolean
  setIsModalMessageOpen: Function
}
function ChatModal({
  profile,
  isModalMessageOpen,
  setIsModalMessageOpen,
}: Props) {
  const { name, picture, userId } = profile
  return (
    <ModalWrapper
      height={"h-[480px]"}
      width={"w-[550px]"}
      preventForceCloseWindow
      isOpen={isModalMessageOpen}
      onRequestClose={() => setIsModalMessageOpen(false)}
    >
      <div className="mt-5 flex justify-center px-10 ">
        <SendMessage
          theirId={userId}
          picture={picture}
          name={name}
          closeModal={() => setIsModalMessageOpen(false)}
        />
      </div>
    </ModalWrapper>
  )
}

export default ChatModal
