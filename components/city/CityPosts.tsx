import { TextField, Tooltip } from "@mui/material"
import React, { Fragment, useState } from "react"
import generateRandomString, { isNullOrEmpty } from "../../lib/scripts/strings"
import ButtonIntegration from "../ButtonIntegration"
import CircularButton from "../CircularButton"
import FeedPost from "../FeedPost/FeedPost"
import Spinner from "../Spinner"
import usePosts from "./usePosts"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
function CityPosts({ place }) {
  const {
    sendPost,
    getPostsQuery,
    messageInput,
    setMessageInput,
    noContent,
    pages,
  } = usePosts(place)

  const { isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    getPostsQuery

  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between">
        <div className="text-2xl">Discussion</div>
      </div>
      <div className="mx-auto bg-gray-50 p-5 rounded-md shadow-md mt-4 px-36">
        <TextField
          id="outlined-multiline-flexible"
          label="Write your post here"
          className="w-full bg-white"
          multiline
          minRows={2}
          maxRows={4}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <div className="flex mt-2 justify-end">
          <CircularButton onClick={() => sendPost()}>
            <SendRoundedIcon className="h-6" />
          </CircularButton>
        </div>

        {isFetching && !isFetchingNextPage && (
          <div className="flex my-10">
            <Spinner className="mx-auto" />
          </div>
        )}

        {noContent ? (
          <div className="text-center text-3xl my-16 ">
            No discussions found
          </div>
        ) : (
          pages && (
            <>
              <div className="border-t mt-5 mb-10"></div>

              {pages.map((group, index) => {
                console.log("group", group)
                console.log("group.data.posts", group.data.posts)
                return (
                  <Fragment key={index}>
                    {group.data.posts.map((post) => (
                      <div key={post._id}>
                        <FeedPost post={post} />
                      </div>
                    ))}
                  </Fragment>
                )
              })}

              <ButtonIntegration
                buttonClassName={`btn mt-10 mb-2 ${
                  !hasNextPage ? "opacity-60 bg-blue-500" : ""
                }`}
                onClick={fetchNextPage}
                disabled={!hasNextPage}
              >
                Load More
              </ButtonIntegration>
            </>
          )
        )}
      </div>
    </div>
  )
}

export default CityPosts
