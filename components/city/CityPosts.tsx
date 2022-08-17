import React from "react"
import FeedPost from "../FeedPost"

function CityPosts({ posts }) {
  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between">
        <div className="text-2xl">Posts</div>
        <button className="btn">New Post</button>
      </div>
      <div className=" mx-auto bg-gray-50 p-5 rounded-md shadow-md mt-4 px-36">
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
      </div>
    </div>
  )
}

export default CityPosts
