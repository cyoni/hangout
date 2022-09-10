import { Avatar, AvatarGroup } from "@mui/material"
import React from "react"
import FeedPost from "./FeedPost/FeedPost"

function MiddleBlock({recentPosts}) {
  const renderRecentTravelers = () => {
    return recentTravelers.map((item) => {
      const profile: Profile = item.profile[0]
      return (
        <a key={item._id} href={`/profile/${profile.userId}`}>
          <div>
            <Avatar alt={profile.name} src={profile.picture} />
          </div>
        </a>
      )
    })
  }
  return (
    <div className="col-span-2 min-h-[400px] ">
      <div>
        <div className="text-xl ">Recent Travelers to [city name]</div>
        <div className="mt-3 flex flex-col rounded-sm  p-3 pb-2">
          <div className="mt-2 flex justify-center space-x-3">
            <AvatarGroup
              total={25}
              sx={{
                "& .MuiAvatar-root": {
                  width: 80,
                  height: 80,
                },
              }}
            >
              {renderRecentTravelers()}
            </AvatarGroup>
          </div>
          <button className=" btn-outline ml-auto mt-4 w-fit py-1 px-4 text-right ">
            Show all
          </button>
        </div>
      </div>

      <div className="">
        <div className="mt-3 text-xl">Recent Discussion</div>
        <div className="my-5 flex space-x-2 border-b pb-4">
          <div className="flex flex-1 space-x-2 ">
            <Avatar className="h-10 w-10" />
            <input
              placeholder="Write your post here"
              className="flex-1 rounded-md border pl-2 outline-none"
            />
          </div>
          <button className="btn px-4">Send</button>
        </div>

        {Array.isArray(recentPosts) &&
          recentPosts.map((post) => {
            return (
              <div key={post._id}>
                <FeedPost post={post} />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default MiddleBlock
