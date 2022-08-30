import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InboxIcon } from "@heroicons/react/outline"
import HeaderImage from "../../components/HeaderImage"
import { formatDate } from "../../lib/dates"
import { queryPlace } from "../../lib/place"
import { getAllTravellingByPlace } from "../../lib/travel"
import Tabs from "../../components/city/CityPageTabs"
import Cities from "../../components/Cities"
import CityPageTabs from "../../components/city/CityPageTabs"
import { getFollowing } from "../api/followApi"
import { getToken } from "next-auth/jwt"
import ButtonIntegration from "../../components/ButtonIntegration"
import useFollow from "../../components/useFollow"
import { CITY } from "../../lib/consts"
import { getSession, useSession } from "next-auth/react"

const defaultCityCode: number = 127407

interface Props {
  travels
  place: Place
  myFollowing: any
}
export default function Home({ travels, place, myFollowing, user }: Props) {
  console.log("user44", user)
  console.log("myFollowing", myFollowing)
  console.log("place", place)
  const { follow, unFollow, isFollowing, getMyFollowingList } =
    useFollow(myFollowing)

  console.log("travels", travels)
  const isFollowingCity = isFollowing(place.city_id)
  const isShowFollowCityBtn =
    !user || (user && user.place.city_id !== place.city_id)
  return (
    <div>
      <Head>
        <title>Hangouts - {place?.city}</title>
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
          {isShowFollowCityBtn && (
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

        <Cities />

        <CityPageTabs travelers={travels} place={place} />
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const token = await getToken(context)

    let cityQueryCode = 0
    const city_id = Number(context.params.city_id)

    if (isNaN(city_id)) {
      cityQueryCode = defaultCityCode
    } else {
      cityQueryCode = city_id
    }
    const user = await getToken(context)

    console.log("cityQueryCode", cityQueryCode)

    const place = await queryPlace(cityQueryCode)

    const travels = await getAllTravellingByPlace(cityQueryCode)
    console.log("travels", JSON.stringify(travels))

    const myFollowing = await getFollowing(token.userId)
    console.log("myFollowing", myFollowing)

    return {
      props: { place, travels, myFollowing, user },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
