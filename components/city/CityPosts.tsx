import { TextField } from "@mui/material"
import React, { useState } from "react"
import ButtonIntegration from "../ButtonIntegration"
import FeedPost from "../FeedPost"
import Spinner from "../Spinner"
import usePosts from "./usePosts"

function CityPosts({ place }) {
  const { sendPost, messageInput, setMessageInput, newPostQuery, getPostsQuery } =
    usePosts(place)
  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between">
        <div className="text-2xl">Posts</div>
      </div>
      <div className=" mx-auto bg-gray-50 p-5 rounded-md shadow-md mt-4 px-36">
        <div className="">
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
              buttonText="Post"
              externalClass="ml-auto"
              buttonClassName="px-10"
              onClick={() => sendPost()}
            />
          </div>
        </div>

        {getPostsQuery.isLoading && (
          <div className="flex my-10">
            <Spinner className="mx-auto" />
          </div>
        )}
        {console.log("getPostsQuery.data", getPostsQuery.data)}
        {getPostsQuery?.data && (
          <div>
            {getPostsQuery.data.data.map((post) => (
              <div key={post._id}>
                <FeedPost post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CityPosts
