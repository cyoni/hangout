import { useState } from "react"
import LocationAutoComplete from "../components/placesAc"
import Spinner from "react-bootstrap/Spinner"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { queryPlace } from "../lib/place"

export default function Travelling({ city_code, connectedUser }) {
  console.log("city_code",city_code)
  console.log("connectedUser", connectedUser)
  const [description, setDescription] = useState<string>("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [place, setPlace] = useState<Place>(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      userId: connectedUser.userId,
      jwt: connectedUser.jwt,
      startDate,
      endDate,
      place,
      description: e.target.description.value,
    }

    const JSONdata = JSON.stringify(data)

    console.log("JSONdata", JSONdata)
    const endpoint = "api/publishTravelling"
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log("response", result) // if OK redirect
  }

  const convertDate = (date) => {
    if (date === null) return null
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  const handleOnChange = (ref) => {
    if (place) {
      ref.current.value = ""
      setPlace(null)
    }
  }

  const handleSelect = (place) => {
    console.log("place", place)
    setPlace(place)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-10 flex w-[40%] flex-col gap-2 p-2 shadow-md"
        method="post"
      >
        <h1 className=" mb-4 text-2xl font-medium">
          Tell others about your upcoming travel
        </h1>

        <label htmlFor="cities">City</label>
        <LocationAutoComplete
          className="rounded-full border p-2 text-gray-400 outline-none"
          onChange={handleOnChange}
          toggleFunction={handleSelect}
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

export async function getServerSideProps(context) {
  try {
    const city_code: number = context.query.city_code || null
    if (city_code) {
      const place: Place = await queryPlace(city_code)
      console.log("place: " + place)
    }

    return {
      props: { city_code },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { city_code: null },
    }
  }
}
