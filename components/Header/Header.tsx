import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { GET_NOTIFICATION_METHOD } from "../../lib/consts/consts"
import { get } from "../../lib/postman"
import Menubar from "./Menubar"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import { useQuery } from "@tanstack/react-query"
import { AutoComplete } from "../AutoComplete"
import { getFullPlaceName } from "../../lib/consts/place"

function Header({ session }) {
  const router = useRouter()
  const [newMessages, setNewMessages] = useState<number>(0)

  useQuery(
    ["unRead-messages-counter"],
    async () => {
      return await get("/api/messagesApi", {
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
    if (place) {
      router.push(`/city/${place._id}`)
    }
  }

  const getOptionLabel = (option: Place) => {
    return getFullPlaceName(option)
  }

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
  }

  return (
    <header className="border-b border-gray-100 p-2 pb-3 ">
      <div className="mx-auto flex flex-wrap items-center justify-between text-gray-700 ">
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
