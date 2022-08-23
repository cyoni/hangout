import { TextField } from "@mui/material"
import React, { useState } from "react"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import ButtonIntegration from "../ButtonIntegration"
import FeedPost from "../FeedPost"
import Spinner from "../Spinner"
import usePosts from "./usePosts"

function CityPosts({ place }) {
  const {
    sendPost,
    messageInput,
    setMessageInput,
    newPostQuery,
    getPostsQuery,
  } = usePosts(place)

  const { isLoading, data: result } = getPostsQuery

  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between">
        <div className="text-2xl">Posts</div>
      </div>
      <div className=" mx-auto bg-gray-50 p-5 rounded-md shadow-md mt-4 px-36">
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
        <div className="flex mt-2">
          <ButtonIntegration
            externalClass="ml-auto"
            buttonClassName="px-10"
            disabled={isNullOrEmpty(messageInput)}
            onClick={() => sendPost()}
          >
            Post
          </ButtonIntegration>
        </div>

        <div className="border-t mt-5 mb-10"></div>

        {isLoading && (
          <div className="flex my-10">
            <Spinner className="mx-auto" />
          </div>
        )}
        {console.log("getPostsQuery.data", getPostsQuery.data)}
        {result?.data && (
          <div>
            {result.data.map((post) => (
              <div key={post._id}>
                <FeedPost post={post} />
              </div>
            ))}
            {getPostsQuery.data.data.length === 0 && (
              <div className="text-center my-10 text-3xl border-t py-10">
                No discussions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CityPosts
