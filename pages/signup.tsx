import { PlacesAutocomplete } from "../lib/PlacesAutoComplete"
import { useState } from "react"
import LocationAutoComplete from "../components/LocationAutoComplete"

export default function Signup() {
  const [placeId, setPlaceId] = useState(null)
  const [location, setLocation] = useState(null) 

  const handleSelect = (location) => {
    setLocation(location)
    console.log("Got location", location)
  }

  const getDataFromAutoComplete = (data) => {
    console.log("got data:", data)
    if (data && data["place_id"]) {
      setPlaceId(data["place_id"])
    }
  }
  const types = ["locality"]
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      placeId: placeId,
    }
    const JSONdata = JSON.stringify(data)
    const endpoint = "api/signup"
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

  return (
    <div className="my-9 flex flex-col items-center ">
      <h1 className="text-3xl">Sign up</h1>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex w-[500px] flex-col"
      >
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="name"
            id="name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dates">Password</label>
          <input
            type="password"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="password"
            id="password"
          />
        </div>
        <div className="flex flex-col">
          <label>City</label>
          <LocationAutoComplete className="rounded-full border p-2 text-gray-400 outline-none" toggleFunction={handleSelect} />
        </div>

        <button
          type="submit"
          className="mt-5 rounded-full bg-blue-600 px-2 py-1 
          text-lg font-medium text-white
          hover:opacity-80"
        >
          Sign up
        </button>
      </form>
    </div>
  )
}
