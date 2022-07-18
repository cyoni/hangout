import React from "react"
import Avatar from "../components/Avatar"
import HeaderImage from "../components/HeaderImage"
import Message from "../components/Message"

function inbox() {
  return (
    <div>
      <HeaderImage title="Messages" />
      <div className="mt-6 max-w-[80%]">
        <Message message="hello world" />
        <Message message="abcd" />
        <Message message="abcd" />
        <Message message="abcd" />
      </div>
    </div>
  )
}

export default inbox
