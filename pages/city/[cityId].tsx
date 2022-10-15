import Head from "next/head"
import HeaderImage from "../../components/Header/HeaderImage"
import { formatDate } from "../../lib/dates"
import CityPageTabs from "../../components/City/CityPageTabs"
import { getFollowing } from "../api/followApi"
import { getToken } from "next-auth/jwt"
import ButtonIntegration from "../../components/Buttons/ButtonIntegration"
import useFollow from "../../components/Hooks/useFollow"
import { CITY } from "../../lib/consts/consts"
import { queryPlace } from "../api/placesAcApi"
import Link from "next/link"

interface Props {
  travels
  place: Place
  myFollowing: any
}
export default function Home({ place, myFollowing, user }: Props) {
  console.log("user44", user)
  console.log("myFollowing", myFollowing)
  console.log("placeId, place", place)

  const { follow, unFollow, isFollowing, getMyFollowingList } =
    useFollow(myFollowing)

  const isFollowingCity = isFollowing(place?.placeId)
  const showFollowCityBtn = user && user.place.placeId !== place?.placeId

  return (
    <div>
      <Head>
        <title>{place?.city} - Hangouts</title>
      </Head>

      <main className="min-h-[600px]">
        <HeaderImage
          backgroundId={place?.city}
          title={place ? `${place.city}, ${place.state}, ${place.country}` : ""}
        >
          {place && showFollowCityBtn && (
            <ButtonIntegration
              externalClass="absolute right-10 top-[40%]"
              buttonClassName="btn text-white w-[200px]
                            right-10 top-0 font-bold hover:bg-blue-700
                             px-7"
              onClick={() =>
                isFollowingCity
                  ? unFollow({
                      placeId: place.placeId,
                      name: place.city,
                      type: CITY,
                    })
                  : follow({
                      placeId: place.placeId,
                      name: place.city,
                      type: CITY,
                    })
              }
              callback={() => {
                getMyFollowingList()
              }}
            >
              {isFollowingCity ? <>Following City</> : <>Follow City</>}
            </ButtonIntegration>
          )}
        </HeaderImage>

        {!place ? (
          <div className="text-center">
            <div className="mt-28 text-2xl">City was not found</div>
            <Link href="/">
              <a className="btn mx-auto mt-5">Home</a>
            </Link>
          </div>
        ) : (
          <CityPageTabs place={place} />
        )}
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const user = await getToken(context)
    const cityId = context.query.cityId
    console.log("cityQueryCode", cityId)
    const place = await queryPlace(cityId)
    console.log("drjngvewsiowoeoi", place)
    const myFollowing = await getFollowing(user.userId)
    console.log("myFollowing", myFollowing)
    return {
      props: { place, myFollowing, user },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
