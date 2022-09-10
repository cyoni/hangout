import Refresh from "@mui/icons-material/Refresh"
import { Avatar, TextField } from "@mui/material"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"
import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { unique } from "../../lib/scripts/arrays"
import { getPastTime } from "../../lib/scripts/general"
import { getFullPlaceName } from "../../lib/scripts/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import ButtonIntegration from "../ButtonIntegration"
import CircularButton from "../CircularButton"
import CustomAvatar from "../CustomAvatar"
import Spinner from "../Spinner"
import usePlace from "../usePlace"
import Comment from "./Comment"
import useComment from "./useComment"

function PostModal({ renderOptions, post, place }) {
  const { sendComment, commentMutation, message, setMessage, commentQuery } =
    useComment(post._id)
  const [session, setSession] = useState<Session>()

  useEffect(() => {
    const x = async () => {
      console.log("dfsgonerouginreoughnerugo")
      setSession(await getSession())
    }
    x()
  }, [])

  console.log("COMMENT SESSION", session)
  const { data: comments } = commentQuery

  const getCityIds = useMemo(() => {
    if (comments) {
      return unique(comments.map((comment) => comment.profile[0].cityId))
    }
  }, [comments])

  const { places, getPlaceFromObject } = usePlace(getCityIds)

  React.useEffect(() => {
    if (commentMutation.isSuccess) {
      toast.success("You comment was successfully posted!")
    }
    if (commentMutation.error) {
      toast.error(
        "You comment was not posted. Please try again later. msg: " +
          commentMutation.error
      )
    }
  }, [commentMutation.error, commentMutation.isSuccess])

  const refresh = async () => {
    const refreshToast = toast.loading("Refreshing...")
    await commentQuery.refetch()
    toast.success("Done", { id: refreshToast })
  }

  const name = post.profile[0].name
  const picture = post.profile[0].picture
  const timestamp = post.timestamp
  const isSubmitButtonDisabled = isNullOrEmpty(message)

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="flex justify-between ml-2">
        <div className="flex space-x-2 mt-4">
          <CustomAvatar
            name={name}
            picture={picture}
            userId={post.userId}
            className="h-24 w-24"
          />
          <div>
            <div className="text-3xl  mt-2 ">{name}</div>
            <p className="text-sm leading-5	">{getFullPlaceName(place)}</p>
            <p className="text-sm leading-3	">{getPastTime(timestamp)}</p>
          </div>
        </div>
        <div>{renderOptions()}</div>
      </div>

      <div className=" border rounded-md p-2 min-h-[150px] my-5">
        {post.message}
      </div>

      <div className="min-h-[150px]  mt-3">
        {commentQuery.isLoading && (
          <div className="mx-auto w-fit mt-10">
            <Spinner />
          </div>
        )}

        {commentQuery.isSuccess && (
          <div className="py-5 mt-5 space-y-5">
            <div className="flex justify-between">
              <div className="font-semibold text-xl">
                {comments.length} Comment
                {comments.length != 1 ? "s" : ""}
              </div>
              <div>
                <CircularButton
                  circularProgressColor="text-blue-500"
                  onClick={() => refresh()}
                >
                  <Refresh className="cursor-pointer text-gray-400 transition duration-75 hover:rotate-180" />
                </CircularButton>
              </div>
            </div>
            <div className="flex gap-4">
              <CustomAvatar
                name={session?.user.name}
                picture={session?.user.image}
                disabled
                className="h-12 w-12"
              />
              <textarea
                id="outlined-multiline-flexible"
                placeholder="Join the conversation"
                className="w-full bg-white outline-none"
                value={message}
                rows={4}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex mt-2 justify-end">
              <ButtonIntegration
                buttonClassName={`btn ${
                  isSubmitButtonDisabled ? "disabled" : ""
                }`}
                onClick={sendComment}
                callback={commentQuery.refetch}
                disabled={isSubmitButtonDisabled}
              >
                Send
              </ButtonIntegration>
            </div>

            <div className="flex flex-col space-y-7">
              {comments.map((comment: IComment) => {
                const cityId = comment?.profile[0]?.cityId
                return (
                  <div key={comment._id}>
                    <Comment {...comment} place={getPlaceFromObject(cityId)} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostModal
