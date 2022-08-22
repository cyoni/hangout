import { EmojiHappyIcon, PlusIcon, ThumbUpIcon } from "@heroicons/react/outline"
import React, { useState } from "react"
import { getPastTime } from "../lib/scripts/general"
import Avatar from "./Avatar"
import ModalWrapper from "./ModalWrapper"
import useFollow from "./useFollow"
import usePlace from "./usePlace"

function FeedPost({ post }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { getFirstPlace } = usePlace([post.profile[0].cityId])
  const place = getFirstPlace()

  const { follow } = useFollow()
 
  follow({userId: "cc"})
  return (
    <div className="mt-4 rounded-md bg-white p-2 shadow-sm cursor-pointer hover:shadow-md">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Avatar className="h-11 w-11" />
          <div className="flex flex-col">
            <div className="font-bold">{post.profile[0].name}</div>
            <div className="text-sm leading-3 ">{place?.city}</div>
            <div className="text-xs">{getPastTime(post.timestamp)}</div>
          </div>
        </div>

        <div className="flex space-x-2 justify-self-center">
          <button className="btn-outline">
            <div className="flex items-center space-x-2">
              <PlusIcon className="h-5" />
              <span>Follow</span>
            </div>
          </button>
        </div>
      </div>
      <div
        className="my-2 max-h-[700px] min-h-[100px] pl-2"
        onClick={() => setIsOpen(true)}
      >
        {post.message}
      </div>
      <ModalWrapper
        height={"  h-[60%]"}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <div className="border p-2 min-h-[200px] rounded-md mt-10">
          {post.message}
        </div>
      </ModalWrapper>
    </div>
  )
}

export default FeedPost
