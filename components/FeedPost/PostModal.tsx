import Refresh from "@mui/icons-material/Refresh"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useMemo, useState } from "react"
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
  const {
    sendComment,
    commentMutation,
    message,
    setMessage,
    commentQuery,
    totalComments,
  } = useComment(post._id)

  const [session, setSession] = useState<Session>()

  useEffect(() => {
    const loadSession = async () => {
      setSession(await getSession())
    }
    loadSession()
  }, [])

  console.log("COMMENT SESSION", session)
  const { data } = commentQuery

  const getCityIds = useMemo(() => {
    if (data) {
      console.log("DATA IS: ", data)
      return unique(
        data.pages[data.pages.length - 1].comments.map(
          (comment) => comment.profile[0].cityId
        )
      )
    }
  }, [data])

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
  const hasData =
    commentQuery.isSuccess &&
    Array.isArray(data.pages[0]?.comments) &&
    data.pages[0].comments.length > 0

  return (
    <div className="mx-auto mt-10 w-[80%]">
      <div className="ml-2 flex justify-between">
        <div className="mt-4 flex space-x-2">
          <CustomAvatar
            name={name}
            picture={picture}
            userId={post.userId}
            overrideLetterIfNoPicture
            className="h-24 w-24"
          />
          <div>
            <div className="mt-2 text-3xl capitalize">{name}</div>
            <p className="text-sm leading-5	">{getFullPlaceName(place)}</p>
            <p className="text-sm leading-3	">{getPastTime(timestamp)}</p>
          </div>
        </div>
        <div>{renderOptions()}</div>
      </div>
      <div className="my-5 min-h-[150px] rounded-md border p-2">
        {post.message}
      </div>

      <div className="mt-3 min-h-[150px]">
        {commentQuery.isLoading && (
          <div className="mx-auto mt-10 w-fit">
            <Spinner />
          </div>
        )}

        {commentQuery.isSuccess && (
          <div className="mt-5 py-5">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">
                  {totalComments} Comment
                  {totalComments != 1 ? "s" : ""}
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
                  className="w-full rounded-md bg-white p-2 outline-none hover:ring-2"
                  value={message}
                  rows={4}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="mt-2 flex justify-end">
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
                {data.pages?.map((group, i) => {
                  return (
                    <Fragment key={i}>
                      {group.comments?.map((comment: IComment) => {
                        const cityId = comment.profile[0]?.cityId
                        return (
                          <div key={comment._id}>
                            <Comment
                              {...comment}
                              place={getPlaceFromObject(cityId)}
                            />
                          </div>
                        )
                      })}
                    </Fragment>
                  )
                })}
              </div>
            </div>
            {!commentQuery.isLoading && hasData && (
              <ButtonIntegration
                externalClass={`btn w-fit mx-auto mt-10 ${
                  !commentQuery.hasNextPage ? "disabled" : ""
                }`}
                disabled={!commentQuery.hasNextPage}
                onClick={() => commentQuery.fetchNextPage()}
              >
                Load More
              </ButtonIntegration>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostModal
