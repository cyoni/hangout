import Head from "next/head"

import HeaderImage from "../components/HeaderImage"
import useFollow from "../components/useFollow"
import generateRandomString from "../lib/scripts/strings"
import { getToken } from "next-auth/jwt"
import { getFollowing } from "./api/followApi"
import { Avatar, AvatarGroup } from "@mui/material"
import { getRecentTravelersByCity } from "../lib/travel"
import usePlace from "../components/usePlace"
import { GetPosts } from "./api/cityApi"
import { Fragment } from "react"
import FeedPost from "../components/FeedPost/FeedPost"
import RightBlock from "../components/RightBlock"
import MiddleBlock from "../components/MiddleBlock"
import LeftBlock from "../components/LeftBlock"

interface Props {
  place: Place
}
export default function Home({
  session,
  followData,
  recentTravelers,
  recentPosts,
}) {
  console.log("My myTest prop", recentPosts)
  const { followQuery } = useFollow(followData)

  const cityIds = followQuery.data?.cities?.[0]?.cityIds

  const { getFirstPlace, places, getPlaceFromObject } = usePlace(cityIds)
  console.log("places index", places)
  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className="">
        <HeaderImage title="Home" />

        <div className="mx-auto mt-10 grid max-w-[70%] grid-cols-4">
          {/* Left block */}
          <LeftBlock />

          {/* Middle block */}
          <MiddleBlock recentPosts={recentPosts} />

          {/* Right block - Favorite cities */}
          <RightBlock
            places={places}
            cityIds={cityIds}
            getPlaceFromObject={getPlaceFromObject}
          />
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const user = await getToken(context)
  if (!user) {
    return {
      props: {
        following: null,
      },
    }
  }

  const cityId = user.place.city_id

  const followData = await getFollowing(user.userId)
  const recentTravelers = await getRecentTravelersByCity(cityId)
  const recentPosts = await GetPosts({ cityId, take: 10 })

  return {
    props: { followData, recentTravelers, recentPosts: recentPosts?.posts },
  }
}
