require("dotenv")

import "../styles/globals.scss"
import Link from "next/link"
import Head from "next/head"
import { isUserVarified } from "../lib/jwtUtils"
import { useEffect, useState } from "react"
import Script from "next/script"
import { useRouter } from "next/router"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import useOnclickOutside from "react-cool-onclickoutside"
import Menubar from "../components/Menubar"
import RightMenuBar from "../components/RightMenuBar"
import Footer from "../components/Footer"

function MyApp({ Component, pageProps }) {
  // const x = process.env.ACCESS_TOKEN_SECRET;

  const isWindow = typeof window !== "undefined"
  const router = useRouter()

  const handleClick = (data) => {
    console.log("got data: ", data)
    router.push(`places?location=${data}`)
  }

  const localStorage = (folder) => {
    const data = window.localStorage.getItem(folder)
    if (data) return JSON.parse(data)
    else return null
  }

  const [connectedUser, setConnectedUser] = useState<jwt>(null)

  useEffect(() => {
    const localUser = localStorage("user")
    console.log("localUser", localUser)
    if (localUser) {
      const varifiedUser = isUserVarified(localUser.token)
      console.log("varifiedUser", varifiedUser)
      if (varifiedUser) {
        setConnectedUser({ jwt: varifiedUser.jwt, user: varifiedUser.user })
      }
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2bqs8mGOMr9IT9Z6bs8FvgbmkiSTWSbU&libraries=places"
        strategy="beforeInteractive"
      ></Script>
      <div className="w-[80%] mx-auto">
        <header className="p-2 pb-3 border-b border-gray-100">
          <div className="mx-auto flex items-center justify-between  text-gray-700">
            <h1>
              <div className="logo">
                <Link href="/">
                  <a className="text-3xl font-medium">Hangouts</a>
                </Link>
              </div>
            </h1>
            <div>location: {connectedUser?.user.place}</div>
            {connectedUser?.user?.name && (
              <>
                <div>hello {connectedUser.user.name}</div>{" "}
                <Link href="/logout">log out</Link>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-9">
          <Menubar />

          <main className="col-span-7 p-5">
            <Component {...pageProps} connectedUser={connectedUser} />
          </main>

          <RightMenuBar />
        </div>

        <Footer />
      </div>
    </>
  )
}

export default MyApp
