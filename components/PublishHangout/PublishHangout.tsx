import React, { useRef, useState } from "react"
import { useRouter } from "next/router"
import HeaderImage from "../Header/HeaderImage"
import { getFullPlaceName } from "../../lib/scripts/place"
import TextField from "@mui/material/TextField"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import Stack from "@mui/material/Stack"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import ButtonIntegration from "../Buttons/ButtonIntegration"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import generateRandomString from "../../lib/scripts/strings"
import usePublishHangout from "./usePublishHangout"
import { useQueryClient } from "@tanstack/react-query"
import { MobileDatePicker } from "@mui/x-date-pickers"
import { formatDate } from "../../lib/dates"
import { IconButton, Tooltip } from "@mui/material"
import { AutoComplete } from "../AutoComplete"
import Head from "next/head"

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
    updateItinerary,
    addNewItinerary,
    removeItinerary,
    handleSelectCity,
    setCurrentIndex,
    description,
    setDescription,
    publishTravels,
  } = usePublishHangout(autoCompleteRef)

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
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-gray-300 ">
                  <div className={`flex ${isLast ? "min-w-[80px]" : ""}  `}>
                    <div className=" mt-5  h-[4px] w-10 bg-gray-500"></div>
                    <div className="text-3xl ">•</div>
                    {!isLast ? (
                      <div className="mt-5  h-[4px] w-10 bg-gray-500"></div>
                    ) : null}
                  </div>
                  <div className="text-lg">{itinerary?.place?.city}</div>
                </div>
                {!isLast ? (
                  <div className="mt-5 h-[4px]  w-14 bg-gray-500"></div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  console.log("currentItinerary?.description", currentItinerary?.description)
  console.log("FFFFFFFF", itineraries)

  return (
    <>
      <Head>
        <title>Publish new trip</title>
      </Head>
      <HeaderImage
        title="Publish a new hangout"
        // backgroundId={newPlace?.city ? newPlace.city : "spiral"}
      />

      {renderCities()}

      <form
        className="mx-auto my-10 flex w-[40%] flex-col space-y-4 rounded-md border p-3 shadow-lg"
        method="post"
      >
        <h1 className="mb-4 text-2xl font-medium">Add Travel</h1>

        <div className="flex flex-col space-y-4 rounded-md border p-3 ">
          <div className="flex justify-between">
            <h2 className="text-xl font-medium">
              Tell others about your upcoming travel
            </h2>
            <div>
              {itineraries.length > 1 && (
                <Tooltip title="Remove travel">
                  <IconButton>
                    <TrashIcon onClick={removeItinerary} className="h-6" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Add another travel">
                <IconButton>
                  <PlusIcon onClick={addNewItinerary} className="h-7" />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <AutoComplete
            label="Where are you going?"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelectCity}
            defaultValue="hello"
            getOptionLabel={getFullPlaceName}
            isOptionEqualToValue={isOptionEqualToValue}
            ref={autoCompleteRef}
          />

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
        </div>

        <div className="rounded-md border p-3">
          <h2 className="mb-7 text-xl font-medium ">
            Add some details about your trip
          </h2>
          <TextField
            className=""
            id="outlined-multiline-static"
            label="Some details here"
            multiline
            rows={12}
            value={description}
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <ButtonIntegration
          externalClass="w-fit mx-auto"
          buttonClassName="btn px-10 mt-5 mb-2 "
          onClick={() => publishTravels()}
        >
          Publish
        </ButtonIntegration>
      </form>
    </>
  )
}
