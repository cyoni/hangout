import Head from "next/head"
import HeaderImage from "../components/Header/HeaderImage"
import useFollow from "../components/Hooks/useFollow"
import { getToken } from "next-auth/jwt"
import { getFollowing } from "./api/followApi"
import usePlace from "../components/Hooks/usePlace"
import MiddleBlock from "../components/Layout/MiddleBlock"
import RightBlock from "../components/Layout/RightBlock"
import LeftBlock from "../components/Layout/LeftBlock"
import { getCityItineraries } from "./api/travelApi"
import { getSession } from "next-auth/react"
import { checkUser } from "../lib/scripts/session"

export default function Home({ session, followData, recentTravelers }) {
  console.log("My session", session)
  const { followQuery } = useFollow(followData)

  const connectedUserPlaceId = session?.data?.place?.placeId
  const placeIds = followQuery.data?.cities?.[0]?.placeIds || []

  console.log("recentTravelers", recentTravelers)

  const { places, getPlaceFromObject } = usePlace([
    ...placeIds,
    connectedUserPlaceId,
  ])
  console.log("places index", places)
  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className="">
        <HeaderImage title="" />

        <div className="mx-auto mt-10 grid-cols-4 px-5 sm:px-16 md:grid md:px-0 xl:max-w-[1300px]">
          {/* Left block */}
          <LeftBlock />

          {/* Middle block */}
          <MiddleBlock
            session={session}
            recentTravelers={recentTravelers}
            getPlaceFromObject={getPlaceFromObject}
          />

          {/* Right block - Favorite cities */}
          <RightBlock
            places={places}
            placeIds={placeIds}
            getPlaceFromObject={getPlaceFromObject}
          />
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const checkUserRes = checkUser(context, session)
  if (checkUserRes.redirect) return checkUserRes

  if (!session) {
    return { props: { following: null } }
  }

  const placeId = session.place?.placeId
  const followData = await getFollowing(session.userId)
  const recentTravelers = await getCityItineraries({
    placeIds: [placeId],
    showAll: true,
  })

  return {
    props: { followData, recentTravelers },
  }
}
