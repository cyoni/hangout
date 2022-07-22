import React, { useEffect } from "react"
import HeaderImage from "../components/HeaderImage"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import data from "../lib/cityImages.json"
import { signIn, signOut, useSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"

function test({ photo }) {
  const { data: session } = useSession()
  console.log("session", session)

  return (
    <>
      {session ? (
        <div>
          HELLO SESSION{" "}
          <p>
            {" "}
            <button onClick={() => signOut()}>Sign out</button>
          </p>
        </div>
      ) : (
        <div>
          NOT CONNECTED<div>
          <button onClick={() => signIn()}>Sign in</button>
          </div>
        </div>
      )}
    </>
  )
}

export default test
