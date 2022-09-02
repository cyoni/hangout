import Head from "next/head"
import Avatar from "../components/Avatar"
import Back from "../components/Back"
import FeedPost from "../components/FeedPost/FeedPost"
import HeaderImage from "../components/HeaderImage"
import Tabs from "../components/city/CityPageTabs"
import useFollow from "../components/useFollow"
import generateRandomString from "../lib/scripts/strings"
import usePlace from "../components/usePlace"
import { useEffect } from "react"
import { getCsrfToken } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { dehydrate, QueryClient, useQuery, UseQueryResult } from "@tanstack/react-query"
import { my_following_list } from "../lib/consts/query"
import { FollowingQuery } from "../lib/queries"
import { getFollowing } from "./api/followApi"

interface Props {
  place: Place
}
export default function Home({ session,myTest }) {
  console.log("My myTest prop", myTest)
  const { followQuery } = useFollow(myTest)

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

        <div className="mx-auto mt-10 grid  max-w-[60%] grid-cols-10">
          <div className=" col-span-2 border-r mr-4">
            <div className="">Publish new a travel</div>
          </div>
          <div className=" col-span-6 min-h-[400px] ">
            <div>
              <div className="text-xl ">Recent Travelers</div>

              <div className="mt-3 flex flex-col rounded-sm border bg-gray-50 p-3 pb-2">
                <div className="mt-2 flex justify-center space-x-3">
                  <div className="h-32 w-32 rounded-md border"></div>
                  <div className="h-32 w-32 rounded-md border"></div>
                  <div className="h-32 w-32 rounded-md border"></div>
                  <div className="h-32 w-32 rounded-md border"></div>
                  <div className="h-32 w-32 rounded-md border"></div>
                </div>
                <button className=" btn-outline ml-auto  mt-4 w-fit py-1 px-4 text-right">
                  More
                </button>
              </div>
            </div>
            <div className="">
              <div className="mt-3 text-xl">Recent Posts</div>
              <div className=" mt-2 border bg-gray-50 p-3">
                {/* <div className="my-5 flex space-x-2 border-b pb-4">
                  <div className="flex flex-1 space-x-2 ">
                    <Avatar className="h-10 w-10" />
                    <input
                      placeholder="Write your post here"
                      className="flex-1 rounded-md border pl-2 outline-none"
                    />
                  </div>
                  <button className="btn px-4">Send</button>
                </div> */}
              </div>
            </div>

            <div>
              <div className="mt-3 text-xl ">Suggested Cities </div>
              <div className="mt-3 flex flex-col rounded-sm border bg-gray-50 p-3 pb-2">
                <div className="mt-2 flex justify-center space-x-3">
                  <div className="h-32 w-32 rounded-full border"></div>
                  <div className="h-32 w-32 rounded-full border"></div>
                  <div className="h-32 w-32 rounded-full border"></div>
                  <div className="h-32 w-32 rounded-full border"></div>
                  <div className="h-32 w-32 rounded-full border"></div>
                </div>
                <button className=" btn-outline ml-auto  mt-4 w-fit py-1 px-4 text-right">
                  More
                </button>
              </div>
            </div>
          </div>
          <div className=" col-span-2 ml-3 border-l p-2 pl-2">
            <div className="mb-3 text-xl ">Favorite Cities</div>
            {places &&
              cityIds &&
              cityIds.map((city) => {
                const place = getPlaceFromObject(city)
                return (
                  <a
                    key={generateRandomString(3)}
                    href={`/city/${place?.city_id}`}
                  >
                    <div className="p-2 rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 hover:text-blue-500">
                      {place?.city}
                    </div>
                  </a>
                )
              })}
            {console.log("followQuery333", followQuery.data)}
          </div>
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

  const followData = await getFollowing(user.userId)

  return {
    props: { myTest: followData },
  }
}
