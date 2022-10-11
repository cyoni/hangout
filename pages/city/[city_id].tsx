import Head from "next/head"
import HeaderImage from "../../components/Header/HeaderImage"
import { formatDate } from "../../lib/dates"
import { queryPlace } from "../../lib/Places/placeUtils"
import Cities from "../../components/Cities"
import CityPageTabs from "../../components/City/CityPageTabs"
import { getFollowing } from "../api/followApi"
import { getToken } from "next-auth/jwt"
import ButtonIntegration from "../../components/Buttons/ButtonIntegration"
import useFollow from "../../components/Hooks/useFollow"
import { CITY } from "../../lib/consts"

interface Props {
  travels
  place: Place
  myFollowing: any
}
export default function Home({ place, myFollowing, user }: Props) {
  console.log("user44", user)
  console.log("myFollowing", myFollowing)
  console.log("city_id, place", place)
  const { follow, unFollow, isFollowing, getMyFollowingList } =
    useFollow(myFollowing)

  const isFollowingCity = isFollowing(place.city_id)
  const showFollowCityBtn =
    !user || (user && user.place.city_id !== place.city_id)

  return (
    <div>
      <Head>
        <title>{place?.city} - Hangouts</title>
      </Head>

      <main>
        <HeaderImage
          backgroundId={place?.city}
          title={
            place
              ? `${place.city}, ${place.province_short}, ${place.country}`
              : ""
          }
        >
          {showFollowCityBtn && (
            <ButtonIntegration
              externalClass="absolute right-10 top-[40%]"
              buttonClassName="btn text-white w-[200px]
                            right-10 top-0 font-bold hover:bg-blue-700
                             px-7"
              onClick={() =>
                isFollowingCity
                  ? unFollow({
                      cityId: place.city_id,
                      name: place.city,
                      type: CITY,
                    })
                  : follow({
                      cityId: place.city_id,
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

        <CityPageTabs place={place} />
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const user = await getToken(context)
    const city_id = Number(context.query.city_id)
    console.log("cityQueryCode", city_id)
    const place = await queryPlace(city_id)
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
