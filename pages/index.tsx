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

export default function Home({ session, followData, recentTravelers }) {
  console.log("My session", session)
  const { followQuery } = useFollow(followData)

  const connectedUserPlaceId = session.place.placeId
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
        <HeaderImage title="Home" />

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
  const user = await getToken(context)

  if (!user) {
    return {
      props: {
        following: null,
      },
    }
  }

  const placeId = user.place?.placeId

  const followData = await getFollowing(user.userId)
  const recentTravelers = await getCityItineraries({
    placeIds: [placeId],
    showAll: true,
  })
  console.log("$$$$$$$$$$$$$$$$$$$", recentTravelers)

  return {
    props: { followData, recentTravelers },
  }
}
