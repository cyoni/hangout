import React, { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import HeaderImage from "../HeaderImage"
import LocationAutoComplete from "../LocationAutoComplete"
import { getFullPlaceName } from "../../lib/scripts/place"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import Stack from "@mui/material/Stack"

import Box from "@mui/material/Box"
import AutoComplete from "../AutoComplete"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import ButtonIntegration from "../ButtonIntegration"
import { PlusIcon } from "@heroicons/react/outline"
import generateRandomString from "../../lib/scripts/strings"
import usePublishHangout from "./usePublishHangout"
import { useQueryClient } from "@tanstack/react-query"

interface Props {
  place?: Place
}

export default function PublishHangout({ place }: Props) {
  console.log("place", place)
  const router = useRouter()

  // const itineraryMock: Itinerary[] = [
  //   {
  //     description: " hello",
  //     place: { city: "Tel Aviv", city_id: 2232 },
  //     startDate: new Date("2022-06-12"),
  //     endDate: new Date("2022-06-15"),
  //   },
  //   {
  //     description: "hello hello",
  //     place: { city: "Jerusalem", city_id: 3453 },
  //     startDate: new Date("2022-06-15"),
  //     endDate: new Date("2022-06-20"),
  //   },
  //   {
  //     description: "asdfsf sdsdfg hello",
  //     place: { city: "Haifa", city_id: 34543 },
  //     startDate: new Date("2022-06-20"),
  //     endDate: new Date("2022-06-25"),
  //   },
  // ]

  // const [description, setDescription] = useState<string>("")
  // const [startDate, setStartDate] = useState<Date>(new Date())
  // const [endDate, setEndDate] = useState<Date>(new Date())
  // const [newPlace, setNewPlace] = useState<Place>(place)

  const {
    currentItinerary,
    itineraries,
    currentIndex,
    isValidForm,
    updateItinerary,
    addNewItinerary,
    handleSelectCity,
    useSubmitItinerary,
  } = usePublishHangout()

  const queryClient = useQueryClient()
  const { status, data, error, isFetching, refetch } = useSubmitItinerary()

  console.log("currentItinerary client", currentItinerary)

  const convertDate = (date) => {
    if (date === null) return null
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  const handleOnChange = (ref) => {
    // if (newPlace) {
    //   ref.current.value = ""
    //   setNewPlace(null)
    // }
  }

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
  }

  const clearForm = () => {
    // setNewPlace(null)
    // setEndDate(new Date())
    // setStartDate(new Date())
    // setDescription("")
  }

  const renderCities = () => {
    return (
      <div className="flex px-5 py-2">
        {itineraries.map((itinerary, i) => {
          const isLast = i === itineraries.length - 1
          return (
            <div key={generateRandomString(10)}>
              <div className="flex ">
                <div className="flex flex-col justify-center items-center hover:bg-gray-300 rounded-lg cursor-pointer ">
                  <div className={`flex ${isLast ? "min-w-[80px]" : ""}  `}>
                    <div className=" bg-gray-500  h-[4px] w-10 mt-5"></div>
                    <div className="text-3xl ">•</div>
                    {!isLast ? (
                      <div className="bg-gray-500  h-[4px] w-10 mt-5"></div>
                    ) : null}
                  </div>
                  <div className="text-lg">{itinerary.place.city}</div>
                </div>
                {!isLast ? (
                  <div className="mt-5 bg-gray-500  h-[4px] w-14"></div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  console.log("currentItinerary?.description", currentItinerary?.description)
  const handleNewItinerary = () => {
    // const newItinerary: Itinerary = {
    //   place: newPlace,
    //   endDate,
    //   startDate,
    //   description,
    // }
    // const newData = itineraries
    // newData.push(newItinerary)
    // setItineraries(newData)
    // clearForm()
    // console.log("newData: ", newData)
  }

  return (
    <div>
      <HeaderImage
        title="Publish a new hangout"
        // backgroundId={newPlace?.city ? newPlace.city : "spiral"}
      />

      {renderCities()}

      <p>status: {status}</p>
      <p>data: {JSON.stringify(data)}</p>
      <p>error: {error}</p>
      <p>fetching: {isFetching}</p>

      <form
        className="mx-auto my-10 flex w-[40%] flex-col space-y-4 rounded-md border p-3 shadow-lg"
        method="post"
      >
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-medium">
            Tell others about your upcoming travel
          </h1>
          <div>
            <PlusIcon
              onClick={addNewItinerary}
              className="h-10 text-gray-400 hover:bg-gray-100 p-2 cursor-pointer rounded-full"
            />
          </div>
        </div>

        <div>
          <AutoComplete
            label="Where are you going?"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelectCity}
            getOptionLabel={getFullPlaceName}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </div>
        {console.log(
          "currentItinerary?.startDate",
          currentItinerary?.startDate
        )}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label="When are you arriving?"
              value={currentItinerary?.startDate}
              onChange={(newValue) => {
                console.log("newValue", newValue)
                updateItinerary("startDate", newValue) //setStartDate(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label="When are you leaving?"
              value={currentItinerary?.endDate}
              onChange={(newValue) => {
                updateItinerary("endDate", newValue)
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
          value={currentItinerary?.description}
          fullWidth
          onChange={(e) => updateItinerary("description", e.target.value)}
        />

        <div className="mt-24">
          <ButtonIntegration buttonClassName="px-10 " onClick={() => refetch()}>
            Publish Itinerary Now
          </ButtonIntegration>
        </div>
      </form>
    </div>
  )
}
