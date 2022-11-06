import {
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import React, { useState } from "react"
import { getPastTime } from "../../lib/scripts/general"
import ModalWrapper from "../Modal/ModalWrapper"
import useFollow from "../Hooks/useFollow"
import usePlace from "../Hooks/usePlace"
import CircularButton from "../Buttons/CircularButton"
import { FOLLOW } from "../../lib/consts/consts"
import ChatModal from "../Modal/ChatModal"
import CustomAvatar from "../Avatar/CustomAvatar"
import { IconButton, Tooltip } from "@mui/material"
import PostModal from "./PostModal"

interface Props {
  post: Post
}
function FeedPost({ post }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)
  const { getFirstPlace } = usePlace([post.profile[0].placeId])
  const place = getFirstPlace()
  const userId = post?.userId
  const { follow, unFollow, isFollowing, getMyFollowingList } = useFollow()

  const handleMessageModal = () => {
    setIsModalMessageOpen(true)
  }

  const renderOptions = () => {
    return (
      <div className="flex items-center ">
        <Tooltip title="Send Message">
          <IconButton onClick={handleMessageModal}>
            <ChatBubbleBottomCenterTextIcon className="h-6" />
          </IconButton>
        </Tooltip>

        <CircularButton
          tooltip={following ? "Unfollow" : "Follow"}
          circularProgressColor="text-blue-500"
          onClick={
            following
              ? () => unFollow({ userId: post.userId, name, type: FOLLOW })
              : () => follow({ userId: post.userId, name, type: FOLLOW })
          }
          callback={getMyFollowingList}
        >
          {following ? (
            <UserCircleIcon className="h-5" />
          ) : (
            <UserPlusIcon className="h-6" />
          )}
        </CircularButton>

        {/* <Tooltip title="Options">
          <IconButton>
            <EllipsisHorizontalCircleIcon className="h-6" />
          </IconButton>
        </Tooltip> */}
      </div>
    )
  }

  const following = isFollowing(post.userId)
  const name = post.profile[0].name
  const picture = post.profile[0].picture

  return (
    <div className="mt-4 cursor-pointer rounded-md bg-white p-2 shadow-sm hover:shadow-md">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <CustomAvatar
            name={name?.toUpperCase()}
            userId={userId}
            picture={picture}
            width="50px"
            height="50px"
            className="h-11 w-11"
          />
          <div className="flex flex-col">
            <div className="font-bold capitalize">{name}</div>
            <div className="text-sm leading-3 ">{place?.city}</div>
            <div className="text-xs">{getPastTime(post.timestamp)}</div>
          </div>
        </div>
        {renderOptions()}
      </div>
      <div
        className="my-2 max-h-[700px] min-h-[100px] pl-2"
        onClick={() => setIsOpen(true)}
      >
        {post.message}
      </div>
      <ModalWrapper
        height={"h-[100vh] md:h-[80vh]"}
        width={"w-[100vw] md:w-[60vw]"}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <PostModal post={post} place={place} renderOptions={renderOptions} />
      </ModalWrapper>

      <ChatModal
        profile={post.profile[0]}
        isModalMessageOpen={isModalMessageOpen}
        setIsModalMessageOpen={setIsModalMessageOpen}
      />
    </div>
  )
}

export default React.memo(FeedPost)
