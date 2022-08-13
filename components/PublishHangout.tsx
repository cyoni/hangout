import React, { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import HeaderImage from "./HeaderImage"
import LocationAutoComplete from "./LocationAutoComplete"
import { getFullPlaceName } from "../lib/scripts/place"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import Stack from "@mui/material/Stack"

import Box from "@mui/material/Box"
import AutoComplete from "./AutoComplete"
import { getCitiesAutoComplete } from "../lib/AutoCompleteUtils"
import ButtonIntegration from "./ButtonIntegration"

interface Props {
  place?: Place
}
export default function PublishHangout({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  console.log("xxxxxxx", router.query.city_id)

  const [description, setDescription] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [newPlace, setNewPlace] = useState<Place>(place)

  const isValidForm = () => {
    let isValid = true

    if (!newPlace) {
      toast.error("Please add a city")
      isValid = false
    }
    if (startDate > endDate) {
      toast.error("End date must be greater than start date")
      isValid = false
    }


    return isValid
  }
  const handleSubmit = async () => {
    if (!isValidForm()) {
      return
    }

    const refreshToast = toast.loading("Publishing hangout...")

    const data: TravelingObject = {
      startDate,
      endDate,
      cityId: newPlace.city_id,
      description,
    }
    console.log("data", data)
    const JSONdata = JSON.stringify(data)
    console.log("JSONdata", JSONdata)

    const endpoint = "/api/publishHangoutApi"
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    if (response.status === 200) {
      toast.success("Publish successfully!", { id: refreshToast })
    } else {
      toast.error("Hangout could not be published", { id: refreshToast })
    }
  }

  const convertDate = (date) => {
    if (date === null) return null
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  const handleOnChange = (ref) => {
    if (newPlace) {
      ref.current.value = ""
      setNewPlace(null)
    }
  }

  const handleSelect = (place) => {
    console.log("place", place)
    setNewPlace(place)
  }

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
  }

  const [value, setValue] = React.useState<Date | null>(new Date())

  return (
    <div>
      <HeaderImage
        title="Publish a new hangout"
        backgroundId={newPlace?.city ? newPlace.city : "spiral"}
      />
      <form
        className="mx-auto my-10 flex w-[40%] flex-col space-y-4 rounded-md border p-3 shadow-lg"
        method="post"
      >
        <h1 className="mb-4 text-2xl font-medium">
          Tell others about your upcoming travel
        </h1>

        <div>
          <AutoComplete
            label="Where are you going?"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelect}
            getOptionLabel={getFullPlaceName}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label="When are you arriving?"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        {/* <DatePicker
          className="w-full rounded-full border p-2 text-gray-400 outline-none"
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
        /> */}

        {/* <DatePicker
          className="w-full rounded-full border p-2 text-gray-400 outline-none"
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
        /> */}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label="When are you leaving?"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        <TextField
          className=""
          id="outlined-multiline-static"
          label="Add some details about your trip"
          multiline
          rows={12}
          value={description}
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-24">
          <ButtonIntegration
            buttonText="Publish Itinerary Now"
            buttonClassName="px-10 "
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </form>
    </div>
  )
}
