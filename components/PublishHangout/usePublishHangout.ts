import { useState } from "react"
import React from "react"

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

  return {
    currentItinerary,
    itineraries,
    currentIndex,
    isValidForm,
    updateItinerary,
    addNewItinerary,
    handleSelectCity,
  }
}

export default usePublishHangout
