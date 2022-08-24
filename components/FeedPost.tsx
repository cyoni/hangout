import {
  CheckIcon,
  EmojiHappyIcon,
  PlusIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline"
import React, { useState } from "react"
import { getPastTime } from "../lib/scripts/general"
import Avatar from "./Avatar"
import ButtonIntegration from "./ButtonIntegration"
import ModalWrapper from "./ModalWrapper"
import useFollow from "./useFollow"
import usePlace from "./usePlace"

interface Props {
  post: Post
}
function FeedPost({ post }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { getFirstPlace } = usePlace([post.profile[0].cityId])
  const place = getFirstPlace()

  const {
    follow,
    unFollow,
    followMutation,
    followQuery,
    isFollowing,
    refreshFollowings,
  } = useFollow()
  console.log("followingData", followQuery.data)
  const followingData: string[] = followQuery.data

  const following = isFollowing(post.userId)
  const name = post.profile[0].name
  return (
    <div className="mt-4 rounded-md bg-white p-2 shadow-sm cursor-pointer hover:shadow-md">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Avatar className="h-11 w-11" />
          <div className="flex flex-col">
            <div className="font-bold">{name}</div>
            <div className="text-sm leading-3 ">{place?.city}</div>
            <div className="text-xs">{getPastTime(post.timestamp)}</div>
          </div>
        </div>

        <ButtonIntegration
          circularProgressColor="bg-blue-600"
          buttonClassName="hover:bg-blue-600 bg-white text-gray-500 btn-outline font-normal  "
          onClick={
            following
              ? () => unFollow({ userId: post.userId, name })
              : () => follow({ userId: post.userId, name })
          }
          callback={refreshFollowings}
        >
          <div className="flex  space-x-2 items-center justify-center   ">
            {following ? (
              <>
                <CheckIcon className="h-5" />
                <span>Following</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-5" />
                <span>Follow</span>
              </>
            )}
          </div>
        </ButtonIntegration>
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
