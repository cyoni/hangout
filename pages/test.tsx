import React, { useEffect, useState } from "react"
import HeaderImage from "../components/HeaderImage"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import data from "../lib/cityImages.json"
import { signIn, signOut, useSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { post } from "../lib/postman"
import Modal from "react-modal"
import AutoComplete from "../components/AutoComplete"

function Test({ photo }) {
  const { data: session } = useSession()
  console.log("session", session)

  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }

  const bg = {
    overlay: {
      background: "yellow",
    },
  }

  return (
    <div>
      <button onClick={toggleModal}>Open modal</button>


<AutoComplete />
    </div>
  )
}

export default Test
