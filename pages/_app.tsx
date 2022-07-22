require("dotenv")

import "../styles/globals.scss"
import Link from "next/link"
import Head from "next/head"
import { isUserVarified } from "../lib/jwtUtils"
import { useEffect, useState } from "react"
import Script from "next/script"
import { useRouter } from "next/router"
import useOnclickOutside from "react-cool-onclickoutside"
import Footer from "../components/Footer"
import Layout from "../components/Layout"
import Header from "../components/Header"
import { Toaster } from "react-hot-toast"
import { post } from "../lib/postman"
import { GET_NOTIFICATION_METHOD } from "../lib/consts"
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, session, pageProps }) {
  // const x = process.env.ACCESS_TOKEN_SECRET;

  const [connectedUser, setConnectedUser] = useState<JWT>(null)
  const [newMessages, setNewMessages] = useState<number>(null)

  const isWindow = typeof window !== "undefined"
  const router = useRouter()

  const localStorage = (folder) => {
    const data = window.localStorage.getItem(folder)
    if (data) return JSON.parse(data)
    else return null
  }

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

  useEffect(() => {
    const getInbox = async () => {
      const body = {
        userId: connectedUser.user.userId,
        jwt: connectedUser.jwt,
        method: GET_NOTIFICATION_METHOD,
      }
      const result = await post({ url: "api/inboxNotificationsApi", body })
      setNewMessages(result.data[0]?.msgs)
      console.log("results from msg api ", result)
    }
    if (connectedUser) getInbox()
  }, [connectedUser])

  /* TODO - Replace connectedUser with nextAuth */

  return (
    <SessionProvider session={session}>
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2bqs8mGOMr9IT9Z6bs8FvgbmkiSTWSbU&libraries=places"
        strategy="beforeInteractive"
      ></Script>

      <Header connectedUser={connectedUser} newMessages={newMessages} />

      <Toaster />

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
    </SessionProvider>
  )
}

export default MyApp
