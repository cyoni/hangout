import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { GET_NOTIFICATION_METHOD } from "../../lib/consts"
import { newGet } from "../../lib/postman"
import Menubar from "./Menubar"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import { useQuery } from "@tanstack/react-query"
import { AutoComplete } from "../AutoComplete"

function Header({ session }) {
  const router = useRouter()
  const [newMessages, setNewMessages] = useState<number>(0)
  const [cityId, setCityId] = useState<number>(null)

  useQuery(
    ["unRead-messages-counter"],
    async () => {
      return await newGet("/api/messagesApi", {
        method: GET_NOTIFICATION_METHOD,
      })
    },
    {
      enabled: !!session?.userId,
      onSuccess: (data) => {
        setNewMessages(data.unreadMessages)
      },
    }
  )

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
            <Link href="/" shallow={false}>
              <a className="text-3xl font-medium">Hangouts</a>
            </Link>
          </div>
          <div
            className="
            w-[300px] rounded-md bg-slate-200
            px-3 py-1 transition-width
            duration-500 focus-within:w-[450px] 
            focus-within:outline hover:w-[450px] hover:outline"
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
