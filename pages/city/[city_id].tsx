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

const defaultCityCode: number = 127407

interface Props {
  travels
  place: Place
  myFollowing: any
}
export default function Home({ travels, place, myFollowing }: Props) {
  const [location, setLocation] = useState(null)

  console.log("myFollowing", myFollowing)

  const router = useRouter()

  console.log("travelstravels", travels)

  return (
    <div>
      <Head>
        <title>Hangouts - {place?.city}</title>
      </Head>

      <main className="">
        <HeaderImage
          backgroundId={place?.city}
          title={
            place
              ? `${place.city}, ${place.province_short}, ${place.country}`
              : ""
          }
        >
          <button className="btn font-bold border   absolute right-10 top-[40%] px-7">
            Follow City
          </button>
        </HeaderImage>

        <Cities />

        <CityPageTabs travelers={travels} place={place} myFollowing={myFollowing} />
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

    console.log("cityQueryCode", cityQueryCode)

    const place = await queryPlace(cityQueryCode)
    console.log("placeplace", place)
    const travels = await getAllTravellingByPlace(cityQueryCode)

    const myFollowing = await getFollowing(token.userId)

    return {
      props: { place, travels, myFollowing },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
