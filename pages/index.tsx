import Head from "next/head"
import { getAllTravellingByPlace } from "../lib/travel"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InboxIcon } from "@heroicons/react/outline"
import HeaderWrapper from "../components/HeaderWrapper"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import { getHeaderPicture } from "../lib/headerImage"

export default function Home({ travelling, hangouts, connectedUser }) {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (connectedUser && connectedUser.user.userId !== undefined) {
    }
  }, [connectedUser])

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
        <HeaderWrapper backgroundId={"Jerusalem"} title="Tel Aviv, Israel" />
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
                      <div className="flex items-center ">
                        <div className="flex-1 font-bold capitalize">
                          {item.name}
                        </div>
                        <InboxIcon className="h-10 w-fit rounded-full p-2  hover:bg-gray-100 " />
                      </div>
                      <div className="flex space-x-2">
                        <div className="">
                          {
                            <Image
                              className="rounded-md"
                              src={item.picture}
                              alt="pic"
                              width={150}
                              height={150}
                            />
                          }
                        </div>
                        {/* info */}
                        <div className="{styles.upcoming.item}">
                          {item.startDate} - {item.endDate}
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
    const travelling = await getAllTravellingByPlace(127407)
    return {
      props: { travelling },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { travelling: [] },
    }
  }
}
