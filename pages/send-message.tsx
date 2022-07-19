import { useState } from "react"
import HeaderImage from "../components/HeaderImage"
import toast from "react-hot-toast"
export default function SendMessagePage({
  connectedUser,
  receiverId,
  receiverName,
}) {
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
    const refreshToast = toast.loading("Sending message...")
    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log("response", result) // if OK redirect
    if (result.isSuccess) {
      toast.success("Message sent!", { id: refreshToast })
    } else {
      toast.error("Message could not be sent", { id: refreshToast })
    }
  }

  return (
    <div className="text-gray-600">
      <HeaderImage title="Send Message" />
      <form
        className="shared-frame flex flex-col p-3"
        onSubmit={handleSubmit}
        method="post"
      >
        <label htmlFor="">To</label>
        <input
          type="text"
          value={receiverName}
          disabled
          className="mt-1 rounded-md border p-2  font-semibold outline-none"
        />

        <label htmlFor="" className="mt-2">
          Message
        </label>
        <textarea
          className="mt-1 rounded-md border p-2 outline-none"
          rows={5}
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button type="submit" className="btn mt-5">
          Send message
        </button>
      </form>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const receiverId = query.id
  const receiverName = query.name

  console.log("receiverId", receiverId)
  if (receiverId && receiverName) {
    return {
      props: { receiverId, receiverName },
    }
  } else {
    return {
      props: { receiverId: null },
    }
  }
}
