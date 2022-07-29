import React, { useEffect } from "react"
import HeaderImage from "../components/HeaderImage"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import data from "../lib/cityImages.json"
import { signIn, signOut, useSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { post } from "../lib/postman"


function test({ photo }) {
  const { data: session } = useSession()
  console.log("session", session)

  useEffect(() => {
    const getMsgs = async () => {
      const xxx = await post({
        url: "/api/inboxNotificationsApi",
        body: { method: "getMessages" },
      })

      console.log("aaaaaaaaaaaaaaaaaaa", xxx)
    }
    getMsgs()
  }, [])
  return <div>TEST SCREEN</div>
}

export default test
