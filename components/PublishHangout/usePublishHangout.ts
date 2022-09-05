import { toast } from "react-hot-toast"
import { useState } from "react"
import React from "react"
import { TRAVEL_API } from "../../lib/consts/apis"
import { useMutation, useQuery } from "@tanstack/react-query"
import { firePost, post } from "../../lib/postman"
import { getFullPlaceName } from "../../lib/scripts/place"
import { POST_NEW_ITINERARY } from "../../lib/consts"

interface Itinerary {
  place: Place
  endDate: Date
  startDate: Date
  description: string
}

function usePublishHangout(autoCompleteRef) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [description, setDescription] = useState<string>("")

  const updateItinerary = (key, value) => {
    const oldItinerary = itineraries[currentIndex]

    const itinerary: Itinerary = {
      ...oldItinerary,
      [key]: value,
    }

    const existingItineraries = [...itineraries]
    if (!oldItinerary) {
      const newItinerary = [...existingItineraries, itinerary]
      setItineraries(newItinerary)
    } else {
      const data = [...existingItineraries]
      data[currentIndex] = itinerary

      setItineraries(data)
    }

    console.log("itinerary", itinerary)
    console.log("currentItinerary", currentItinerary)
    console.log("itineraries", itineraries)
  }

  console.log("itineraries", itineraries)

  const handleSelectCity = (place) => {
    updateItinerary("place", place)
  }

  const currentItinerary = itineraries[currentIndex]
  console.log("currentItinerary..", currentItinerary)

  const addNewItinerary = () => {
    setCurrentIndex(currentIndex + 1)
    setItineraries([
      ...itineraries,
      {
        startDate: "",
        endDate: "",
        place: { city: "", province: "", country: "" },
      },
    ])
    autoCompleteRef?.current?.setAutoCompleteValue("")
  }

  const isValidForm = () => {
    let isValid = true

    return isValid
  }

  const triggerTravelMutation = (body) => {
    return post({
      url: TRAVEL_API,
      body: { ...body },
    })
  }

  const travelMutation = useMutation(triggerTravelMutation)

  const publishTravels = async () => {
    await travelMutation.mutateAsync(
      {
        method: POST_NEW_ITINERARY,
        description,
        itineraries,
      },
      {
        onSuccess: () => {
          toast.success(`Your itinerary is live`)
        },
        onError: () => {
          toast.error(`Your post could not be published right now.`)
        },
      }
    )
  }


  return {
    currentItinerary,
    description,
    setDescription,
    itineraries,
    currentIndex,
    setCurrentIndex,
    isValidForm,
    updateItinerary,
    addNewItinerary,
    handleSelectCity,
    publishTravels
  }
}

export default usePublishHangout
