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

const defaultCityCode: number = 127407

interface Props {
  travels
  place: Place
}
export default function Home({ travels, place }: Props) {
  const [location, setLocation] = useState(null)

  const router = useRouter()
  const handleTravelRoute = (userId) => {
    return `/intro?userId=${userId}`
  }
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
        />
        <div className="mt-1 flex border-b pl-2 pb-1">
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
          <div className="cursor-pointer rounded-xl py-1 px-2 hover:bg-gray-200">
            item
          </div>
        </div>

        <div className="">
          <div className="mx-auto grid w-[750px] grid-cols-2 gap-5">
            {Array.isArray(travels) &&
              travels.length > 0 &&
              travels.map((item, i) => {
                return (
                  <Link key={i} href={handleTravelRoute(item.userId)}>
                    <div className="mt-5 flex cursor-pointer flex-col rounded-md p-2 shadow-md hover:shadow-lg">
                      <div className="flex items-center justify-between ">
                        <div className="font-bold capitalize">
                          {item.profile.name}
                        </div>
                        <Link
                          href={`/send-message?id=${item.userId}&name=${item.profile.name}`}
                        >
                          <InboxIcon className="h-10  rounded-full p-2 hover:bg-gray-100 " />
                        </Link>
                      </div>
                      <div className="flex space-x-2">
                        {/* profile image */}
                        <div className="h-[150px] w-[150px]">
                          {
                            <img
                              className="w-full h-full rounded-md shadow-md"
                              src={item.profile.picture}
                              alt="pic"
                            />
                          }
                        </div>
                        {/* info */}
                        <div className="w-[180px]">
                          {formatDate(item.startDate)} -{" "}
                          {formatDate(item.endDate)}
                          {/* country */}
                          {item.location?.country && (
                            <div className="{styles.upcoming.item}">
                              {item.location.country}
                            </div>
                          )}
                          <div className="line-clamp-5">{item.description}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
          <div className="link w-fit">
            <Link
              href={`/more-travels?country=${location?.country}&state=${location?.state}&city=${location?.city}`}
            >
              More
            </Link>
          </div>
        </div>
        <div></div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
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
    return {
      props: { place, travels },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
