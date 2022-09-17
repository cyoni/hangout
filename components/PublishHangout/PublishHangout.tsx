import React, { useRef, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import HeaderImage from "../HeaderImage"
import { getFullPlaceName } from "../../lib/scripts/place"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import Stack from "@mui/material/Stack"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import ButtonIntegration from "../ButtonIntegration"
import { PlusIcon } from "@heroicons/react/24/outline"
import generateRandomString from "../../lib/scripts/strings"
import usePublishHangout from "./usePublishHangout"
import { useQueryClient } from "@tanstack/react-query"
import { MobileDatePicker } from "@mui/x-date-pickers"
import { formatDate } from "../../lib/dates"
import { IconButton } from "@mui/material"
import { AutoComplete } from "../AutoComplete"

interface Props {
  place?: Place
}

export default function PublishHangout({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  const autoCompleteRef = useRef()

  const {
    currentItinerary,
    itineraries,
    currentIndex,
    isValidForm,
    updateItinerary,
    addNewItinerary,
    handleSelectCity,
    setCurrentIndex,
    description,
    setDescription,
    publishTravels,
  } = usePublishHangout(autoCompleteRef)

  const queryClient = useQueryClient()

  console.log("currentItinerary client", currentItinerary)

  const handleOnChange = (ref) => {}

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
  }

  console.log("current itin index", itineraries[currentIndex])

  const clearForm = () => {}

  const renderCities = () => {
    return (
      <div className="flex px-5 py-2">
        {itineraries.map((itinerary, i) => {
          const isLast = i === itineraries.length - 1
          return (
            <div
              key={generateRandomString(10)}
              onClick={() => setCurrentIndex(i)}
            >
              <div className="flex ">
                <div className="flex flex-col justify-center items-center hover:bg-gray-300 rounded-lg cursor-pointer ">
                  <div className={`flex ${isLast ? "min-w-[80px]" : ""}  `}>
                    <div className=" bg-gray-500  h-[4px] w-10 mt-5"></div>
                    <div className="text-3xl ">•</div>
                    {!isLast ? (
                      <div className="bg-gray-500  h-[4px] w-10 mt-5"></div>
                    ) : null}
                  </div>
                  <div className="text-lg">{itinerary?.place?.city}</div>
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
  const handleNewItinerary = () => {}

  return (
    <div>
      <HeaderImage
        title="Publish a new hangout"
        // backgroundId={newPlace?.city ? newPlace.city : "spiral"}
      />

      {renderCities()}

      <form
        className="mx-auto my-10 flex w-[40%] flex-col space-y-4 rounded-md border p-3 shadow-lg"
        method="post"
      >
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-medium">
            Tell others about your upcoming travel
          </h1>
          <div>
            <IconButton>
              <PlusIcon onClick={addNewItinerary} className="h-7" />
            </IconButton>
          </div>
        </div>
        <div>
          <AutoComplete
            label="Where are you going?"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelectCity}
            getOptionLabel={getFullPlaceName}
            isOptionEqualToValue={isOptionEqualToValue}
            ref={autoCompleteRef}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDatePicker
              label="When are you arriving?"
              value={formatDate(currentItinerary?.startDate)}
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
              value={formatDate(currentItinerary?.endDate)}
              onChange={(newValue) => {
                console.log("endDate newValue", newValue)
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
          value={description}
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-24">
          <ButtonIntegration
            externalClass="w-fit mx-auto"
            buttonClassName="btn px-10  "
            onClick={() => publishTravels()}
          >
            Publish
          </ButtonIntegration>
        </div>
      </form>
    </div>
  )
}
