import { toast } from "react-hot-toast"
import { useState } from "react"
import React from "react"
import { PUBLISH_TRAVEL_API } from "../../lib/consts/apis"
import { useQuery } from "@tanstack/react-query"
import { firePost } from "../../lib/postman"

interface Itinerary {
  place: Place
  endDate: Date
  startDate: Date
  description: string
}

function usePublishHangout() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  

  console.log("XXXXXXXXX", itineraries)

  const updateItinerary = (key, value) => {
    const oldItinerary = itineraries[currentIndex]

    const itinerary: Itinerary = {
      ...oldItinerary,
      [key]: value,
    }
    const updatedItineraries = itineraries
    if (!oldItinerary) {
      updatedItineraries.push(itinerary)
    } else updatedItineraries[currentIndex] = itinerary

    setItineraries(updatedItineraries)

    console.log("itinerary", itinerary)
    console.log("updatedItineraries", updatedItineraries)
    console.log("currentItinerary", currentItinerary)
    console.log("itineraries", itineraries)
  }

  console.log("itineraries", itineraries)

  const handleSelectCity = (place) => {
    updateItinerary("place", place)
  }

  const abc = () => {
    return itineraries[currentIndex]
  }
  const currentItinerary = abc()
  console.log("currentItinerary..", currentItinerary)

  const addNewItinerary = () => {
    setCurrentIndex(currentIndex + 1)
  }

  const isValidForm = () => {
    let isValid = true

    // if (!newPlace) {
    //   toast.error("Please add a city")
    //   isValid = false
    // }
    // if (startDate > endDate) {
    //   toast.error("End date must be greater than start date")
    //   isValid = false
    // }

    return isValid
  }

  const useSubmitItinerary = () => {
    // if (!isValidForm()) {
    //   return
    // }
    console.log("send", JSON.stringify(itineraries))

    return useQuery(
      ["publish-itinerary"],
      async () => {
        return await firePost(PUBLISH_TRAVEL_API, {
          itineraries,
        })
      },
      { enabled: false }
    )

    // const data: TravelingObject = {
    //   startDate,
    //   endDate,
    //   cityId: newPlace.city_id,
    //   description,
    // }

    //console.log("data", data)
    // const JSONdata = JSON.stringify(data)
    //  console.log("JSONdata", JSONdata)

    // const endpoint = PUBLISH_TRAVEL_API
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSONdata,
    // }
    // const response = await fetch(endpoint, options)
    // const refreshToast = toast.loading("Publishing hangout...")
    // if (response.status === 200) {
    //   toast.success("Publish successfully!", { id: refreshToast })
    // } else {
    //   toast.error("Hangout could not be published", { id: refreshToast })
    // }
  }

  return {
    currentItinerary,
    itineraries,
    currentIndex,
    isValidForm,
    updateItinerary,
    addNewItinerary,
    handleSelectCity,
    useSubmitItinerary,
  }
}

export default usePublishHangout
