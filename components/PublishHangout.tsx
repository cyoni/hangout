import { useState } from "react"
import Spinner from "react-bootstrap/Spinner"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import HeaderImage from "./HeaderImage"
import LocationAutoComplete from "./LocationAutoComplete"
import { getFullPlaceName } from "../lib/scripts/place"

interface Props {
  place?: Place
}
export default function PublishHangout({ place }: Props) {
  console.log("place", place)
  const router = useRouter()
  console.log("xxxxxxx", router.query.city_id)

  const [description, setDescription] = useState<string>("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [newPlace, setNewPlace] = useState<Place>(place)

  const handleSubmit = async (e) => {
    const refreshToast = toast.loading("Publishing hangout...")

    e.preventDefault()

    const data: TravellingObject = {
      startDate,
      endDate,
      cityId: newPlace.city_id,
      description: e.target.description.value,
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

  return (
    <div>
      <HeaderImage
        title="Publish a new hangout"
        backgroundId={newPlace?.city ? newPlace.city : "spiral"}
      />
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-10 flex w-[40%] flex-col gap-2 rounded-md border p-3 shadow-lg"
        method="post"
      >
        <h1 className="mb-4 text-2xl font-medium">
          Tell others about your upcoming travel
        </h1>

        <label htmlFor="cities">City</label>
        <LocationAutoComplete
          className="rounded-full border p-2 text-gray-400 outline-none"
          onChange={handleOnChange}
          toggleFunction={handleSelect}
          initialValue={getFullPlaceName(place)}
        />

        <label>Arrival</label>

        <DatePicker
          className="w-full rounded-full border p-2 text-gray-400 outline-none"
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
        />

        <label>Departure</label>
        <DatePicker
          className="w-full rounded-full border p-2 text-gray-400 outline-none"
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
        />

        <label htmlFor="description">Description</label>
        <textarea
          className="mt-2 rounded-md border p-2 text-gray-400 outline-none"
          rows={5}
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <Spinner animation="border" size="sm" variant="success" />
        <button type="submit" className="btn my-5 mx-auto w-full">
          Publish
        </button>
      </form>
    </div>
  )
}
