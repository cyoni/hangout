import Head from "next/head"
import { getAllTravellingByPlace } from "../lib/travel"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InboxIcon } from "@heroicons/react/outline"
import HeaderImage from "../components/HeaderImage"
import { queryPlace } from "../lib/place"
import { formatDate } from "../lib/dates"
import { signIn, useSession } from "next-auth/react"

const defaultCityCode: number = 127407

interface Props {
  place: Place
}
export default function Home({
  travelling,
  hangouts,
  place,
  connectedUser,
}: Props) {
  const [location, setLocation] = useState(null)

  const router = useRouter()
  console.log("hangouts", hangouts)
  const handleTravelRoute = (userId) => {
    return `/intro?userId=${userId}`
  }
  console.log("travelling", travelling)

  return (
    <div>
      <Head>
        <title>Hangout</title>
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
            {travelling &&
              travelling.length > 0 &&
              travelling.map((item, i) => {
                return (
                  <a
                    key={i}
                    className="mt-5 rounded-md shadow-md hover:shadow-lg"
                    href={handleTravelRoute(item.userId)}
                  >
                    <div className="flex flex-col px-2 ">
                      {/* profile image */}
                      <div className="flex items-center justify-between ">
                        <div className="font-bold capitalize">
                          {item.profile[0].name}
                        </div>
                        <InboxIcon className="h-10  rounded-full p-2  hover:bg-gray-100 " />
                      </div>
                      <div className="flex space-x-2">
                        <div className="">
                          {
                            <img
                              className="rounded-md"
                              src={item.profile[0].picture}
                              alt="pic"
                              width={150}
                              height={150}
                            />
                          }
                        </div>
                        {/* info */}
                        <div className="">
                          {formatDate(item.startDate)} -{" "}
                          {formatDate(item.endDate)}
                          {/* country */}
                          {item.location?.country && (
                            <div className="{styles.upcoming.item}">
                              {item.location.country}
                            </div>
                          )}
                          <div>{item.description}</div>
                        </div>
                      </div>
                    </div>
                  </a>
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
    const city_id = Number(context.query.city_id)

    if (isNaN(city_id)) {
      cityQueryCode = defaultCityCode
    } else {
      cityQueryCode = city_id
    }

    console.log("cityQueryCode", cityQueryCode)

    const place = await queryPlace(cityQueryCode)
    console.log("placeplace", place)
    const travelling = await getAllTravellingByPlace(cityQueryCode)
    return {
      props: { place, travelling },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
