import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { GET_NOTIFICATION_METHOD } from "../lib/consts"
import { post } from "../lib/postman"
import { isAuthenticated } from "../lib/session"
import Menubar from "./Menubar"
import LocationAutoComplete from "./placesAc"

function Header() {
  const router = useRouter()
  const session = useSession()
  const [newMessages, setNewMessages] = useState<number>(null)

  useEffect(() => {
    const getInbox = async () => {
      const body = {
        userId: session.data.userId,
        method: GET_NOTIFICATION_METHOD,
      }
      const result = await post({ url: "/api/inboxNotificationsApi", body })
      console.log("getInbox result", result)
      if (result.isSuccess) {
        setNewMessages(result.data.msgs)
      }
    }

    if (isAuthenticated(session)) getInbox()
  }, [session])

  const handleSelect = (place: Place, inputRef) => {
    if (place && place.city_id) {
      router.push(`/city/${place.city_id}`)
      inputRef.current.value = ""
    }
  }

  return (
    <header className="border-b border-gray-100 p-2 pb-3 ">
      <div className="mx-auto flex items-center justify-between  text-gray-700 ">
        <div className="flex items-center space-x-4">
          <div className="px-7 ">
            <Link href="/">
              <a className="text-3xl font-medium">Hangouts</a>
            </Link>
          </div>
          <div className="rounded-md bg-slate-200 py-2">
            <LocationAutoComplete
              toggleFunction={handleSelect}
              position="top-2"
              className="w-60 bg-transparent pl-2 outline-none "
              placeholder="Where are you going?"
            />
          </div>
        </div>

        <Menubar newMessages={newMessages} />
      </div>
    </header>
  )
}

export default Header
