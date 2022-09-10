import { Avatar, AvatarGroup } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"
import { POST, TRAVEL } from "../../lib/consts"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import ButtonIntegration from "../ButtonIntegration"
import usePosts from "../city/usePosts"
import CustomAvatar from "../CustomAvatar"
import FeedPost from "../FeedPost/FeedPost"
import Spinner from "../Spinner"

function MiddleBlock({ session, recentTravelers }) {
  const userCityId = session?.place?.city_id
  const cityName = session?.place?.city
  const router = useRouter()
  const user = session?.user
  const { sendPost, postsQuery, messageInput, setMessageInput } = usePosts({
    cityId: userCityId,
    take: 10,
  })

  const renderRecentTravelers = () => {
    return (
      Array.isArray(recentTravelers) &&
      recentTravelers.map((item) => {
        const profile: Profile = item.profile[0]
        return (
          <a key={item._id} href={`/profile/${profile.userId}`}>
            <div>
              <Avatar alt={profile.name} src={profile.picture} />
            </div>
          </a>
        )
      })
    )
  }

  return (
    <div className="col-span-2 min-h-[400px] ">
      <div>
        <div className="text-xl ">Recent Travelers to {cityName}</div>
        <div className="mt-3 flex flex-col rounded-sm  p-3 pb-2">
          <div className="mt-2 flex justify-center space-x-3">
            <AvatarGroup
              total={recentTravelers?.length}
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
          <button
            className=" btn-outline ml-auto mt-4 w-fit py-1 px-4 text-right"
            onClick={() => router.push(`city/${userCityId}?view=${TRAVEL}`)}
          >
            Show all
          </button>
        </div>
      </div>

      <div className="">
        <div className="mt-3 text-xl">Recent Discussion</div>

        <div className="my-5  space-x-2 pb-4">
          <div className="flex flex-1 space-x-2 ">
            <CustomAvatar
              name={user?.name}
              picture={user?.image}
              disabled
              className="h-10 w-10"
            />

            <textarea
              id="outlined-multiline-flexible"
              placeholder="Start a discussion"
              rows={3}
              className="outline-none w-full pl-1 mt-1"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <ButtonIntegration
              disabled={isNullOrEmpty(messageInput)}
              externalClass={`btn w-fit mt-2 ${
                isNullOrEmpty(messageInput) ? "disabled" : ""
              }`}
              onClick={() => sendPost()}
            >
              Send
            </ButtonIntegration>
          </div>
        </div>

        {postsQuery.isFetching && <Spinner />}
        {Array.isArray(postsQuery.data?.posts) &&
          postsQuery.data?.posts.map((post) => {
            return (
              <div key={post._id}>
                <FeedPost post={post} />
              </div>
            )
          })}
        <button
          className="btn-outline mt-2 block ml-auto"
          onClick={() => router.push(`city/${userCityId}?view=${POST}`)}
        >
          More
        </button>
      </div>
    </div>
  )
}

export default MiddleBlock
