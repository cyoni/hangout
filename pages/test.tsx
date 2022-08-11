import React, { useEffect, useState } from "react"
import HeaderImage from "../components/HeaderImage"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import data from "../lib/cityImages.json"
import { signIn, signOut, useSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { post } from "../lib/postman"
import Modal from "react-modal"

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
      <Modal
        style={{
          overlay: {
            background: "transparent",
            backdropFilter: "blur(3px)",
          },
        }}
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
      >
        <div>My modal dialog.</div>
        <button onClick={toggleModal}>Close modal</button>
      </Modal>
    </div>
  )
}

export default Test
