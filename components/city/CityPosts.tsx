import { TextField } from "@mui/material"
import React, { useState } from "react"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import ButtonIntegration from "../ButtonIntegration"
import CircularButton from "../CircularButton"
import FeedPost from "../FeedPost"
import Spinner from "../Spinner"
import usePosts from "./usePosts"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
function CityPosts({ place }) {
  const {
    sendPost,
    getPostsQuery,
    messageInput,
    setMessageInput,
    bringMore
  } = usePosts(place)

  const { isFetching,  data: result } = getPostsQuery

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

        <div className="border-t mt-5 mb-10"></div>

        {isFetching && (
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
            <div className="mt-10">
          </div>
          </div>
        )}
                  <ButtonIntegration buttonClassName="btn" onClick={bringMore}>Bring More</ButtonIntegration>

      </div>
    </div>
  )
}

export default CityPosts
