import { useState } from "react"
import randomString from "../lib/randomString"
import styles from "../styles/publish-itinerary.module.css"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers"
import TextField from "@mui/material/TextField"
import { Button, Stack } from "@mui/material"

export default function SendMessagePage({ connectedUser, receiverId }) {
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      jwt: connectedUser.jwt,
      senderId: connectedUser.user.userId,
      receiverId: receiverId,
      message,
    }

    const JSONdata = JSON.stringify(data)

    console.log("JSONdata", JSONdata)
    const endpoint = "api/sendMessage"
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log("response", result) // if OK redirect
  }

  return (
    <div>
      <form onSubmit={handleSubmit} method="post">
        <h1>Send message</h1>
        <textarea
          className="form-control"
          rows={5}
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit" className="btn btn-primary">
          Send message
        </button>
      </form>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const receiverId = query.userId
  console.log("receiverId", receiverId)

  return {
    props: { receiverId },
  }
}
