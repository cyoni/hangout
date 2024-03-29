import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { TRAVEL_API } from "../../lib/consts/apis"
import { useMutation, useQuery } from "@tanstack/react-query"
import { post } from "../../lib/postman"
import { getFullPlaceName } from "../../lib/consts/place"
import { POST_NEW_ITINERARY } from "../../lib/consts/consts"
import { isNullOrEmpty } from "../../lib/scripts/strings"

interface Itinerary {
  place: Partial<Place>
  endDate: Date
  startDate: Date
  description: string
}

function usePublishHangout(autoCompleteRef) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [description, setDescription] = useState<string>("")
  const router = useRouter()

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

  useEffect(() => {
    const place = itineraries[currentIndex]?.place
    console.log("use effect", place)
    const fullName = !isNullOrEmpty(place?.city) ? getFullPlaceName(place) : ""
    autoCompleteRef?.current?.setAutoCompleteValue(fullName)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log("itineraries", itineraries)

  const handleSelectCity = (place) => {
    updateItinerary("place", place)
  }

  const removeItinerary = () => {
    const data = itineraries.filter((itineraries, i) => i !== currentIndex)
    setItineraries(data)
    setCurrentIndex((prev) => prev - 1)
  }

  const currentItinerary = itineraries[currentIndex]

  const isFormValid = () => {
    if (isNullOrEmpty(currentItinerary?.place?.city)) {
      toast.error("Please select a city.")
      return false
    }
    if (currentItinerary?.startDate > currentItinerary?.endDate) {
      toast.error("Start date can't be less than end date.")
      return false
    }

    if (isNullOrEmpty(currentItinerary?.startDate)) {
      toast.error("Please set a start date.")
      return false
    }

    if (isNullOrEmpty(currentItinerary?.endDate)) {
      toast.error("Please set an end date.")
      return false
    }

    return true
  }

  const addNewItinerary = () => {
    console.log("currentItinerary..", currentItinerary)

    if (!isFormValid()) return

    setCurrentIndex(currentIndex + 1)
    setItineraries([
      ...itineraries,
      {
        startDate: null,
        endDate: null,
        place: { city: "", state: "", country: "" },
        description: "",
      },
    ])
    autoCompleteRef?.current?.setAutoCompleteValue("")
  }

  const triggerTravelMutation = (body) => {
    return post({
      url: TRAVEL_API,
      body: { ...body },
    })
  }

  const travelMutation = useMutation(triggerTravelMutation)

  const publishTravels = async () => {
    if (!isFormValid()) return

    await travelMutation.mutateAsync(
      {
        method: POST_NEW_ITINERARY,
        description,
        itineraries,
      },
      {
        onSuccess: () => {
          toast.success("Your itinerary is live")
          router.push("/profile")
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
    updateItinerary,
    removeItinerary,
    addNewItinerary,
    handleSelectCity,
    publishTravels,
  }
}

export default usePublishHangout
