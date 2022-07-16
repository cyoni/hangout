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
import Layout from "../components/Layout"
import Header from "../components/Header"

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

  const [connectedUser, setConnectedUser] = useState<JWT>(null)

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

  /* TODO - Replace connectedUser with nextAuth */

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2bqs8mGOMr9IT9Z6bs8FvgbmkiSTWSbU&libraries=places"
        strategy="beforeInteractive"
      ></Script>

      <Header connectedUser={connectedUser} />
      
      <div className="">
        <div className="">
          

          <Layout
            Component={Component}
            pageProps={pageProps}
            connectedUser={connectedUser}
          />

          
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default MyApp
