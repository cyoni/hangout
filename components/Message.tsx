import React from "react"
import Avatar from "./Avatar"
import HeaderImage from "./HeaderImage"

function Message({ message }) {
  return (
    <div className="mx-5 relative flex gap-7 border-b border-b-gray-100 py-5 pl-5 text-gray-600">
      
      <div className="text-[50px] absolute left-0 top-3 text-red-600 font-bold hidden">·</div>
      <div className="flex gap-2">
        <Avatar className="h-14 w-14" />

        <div className="">
          <div className="font-bold">Yoni</div>
          <div>Tel Aviv, Israel</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col rounded-md  p-3">
        <div className="cursor-pointer truncate rounded-md bg-gray-100 p-2 shadow-sm hover:bg-gray-200">
          {message}
        </div>
        <div className="ml-auto text-sm">10 hours ago</div>
      </div>
    </div>
  )
}

export default Message
