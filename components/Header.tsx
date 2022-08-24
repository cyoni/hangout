import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { GET_NOTIFICATION_METHOD } from "../lib/consts"
import { post } from "../lib/postman"
import { isAuthenticated } from "../lib/session"
import Menubar from "./Menubar"
import LocationAutoComplete from "./LocationAutoComplete"
import AutoComplete from "./AutoComplete"
import { getCitiesAutoComplete } from "../lib/AutoCompleteUtils"

function Header() {
  const router = useRouter()
  const session = useSession()
  const [newMessages, setNewMessages] = useState<number>(null)
  const [cityId, setCityId] = useState<number>(null)

  useEffect(() => {
    const getInbox = async () => {
      const body = {
        userId: session.data.userId,
        method: GET_NOTIFICATION_METHOD,
      }
      const result = await post({ url: "/api/messagesApi", body })
      console.log("getInbox result", result)
      setNewMessages(result.unreadMsgs)
    }

    if (isAuthenticated(session)) {
      console.log("getting messages....")
      getInbox()
    }
  }, [session])

  const handleSelect = (place: Place) => {
    if (place && place.city_id) {
      setCityId(place.city_id)
      router.push(`/city/${place.city_id}`)
    }
  }
  const getFullName = (place: Place) => {
    return `${place.city}, ${place.province}, ${place.country}`
  }

  const getOptionLabel = (option: Place) => {
    return getFullName(option)
  }

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
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
          <div
            className="
            rounded-md focus-within:w-[450px] focus-within:outline
            hover:outline bg-slate-200 w-[300px]
            hover:w-[450px] transition-width 
            duration-500 px-3 py-1"
          >
            <AutoComplete
              placeholder="Where are you going?"
              fetchFunction={getCitiesAutoComplete}
              handleSelect={handleSelect}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
              disableUnderline={true}
              variant={"standard"}
            />
          </div>
        </div>

        <Menubar newMessages={newMessages} />
      </div>
    </header>
  )
}

export default Header
