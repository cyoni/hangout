import Head from "next/head"
import HeaderImage from "../components/HeaderImage"
import useFollow from "../components/useFollow"
import { getToken } from "next-auth/jwt"
import { getFollowing } from "./api/followApi"
import { getRecentTravelersByCity } from "../lib/travel"
import usePlace from "../components/usePlace"
import { GetPosts } from "./api/cityApi"
import MiddleBlock from "../components/Layout/MiddleBlock"
import RightBlock from "../components/Layout/RightBlock"
import LeftBlock from "../components/Layout/LeftBlock"

export default function Home({ session, followData, recentTravelers }) {
  console.log("My session", session)
  const { followQuery } = useFollow(followData)

  const cityIds = followQuery.data?.cities?.[0]?.cityIds

  const { places, getPlaceFromObject } = usePlace(cityIds)
  console.log("places index", places)
  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className="">
        <HeaderImage title="Home" />

        <div className="mx-auto mt-10 grid xl:max-w-[1300px] grid-cols-4">
          {/* Left block */}
          <LeftBlock />

          {/* Middle block */}
          <MiddleBlock session={session} recentTravelers={recentTravelers} />

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

  return {
    props: { followData, recentTravelers },
  }
}
