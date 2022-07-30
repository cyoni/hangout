import { useState } from "react"
import LocationAutoComplete from "../components/placesAc"
import { useRouter } from "next/router"
import HeaderImage from "../components/HeaderImage"
import { signIn } from "next-auth/react"

export default function Signup() {
  const [placeId, setPlaceId] = useState(null)
  const [place, setPlace] = useState<Place>(null)
  const router = useRouter()

  const handleSelect = (place) => {
    setPlace(place)
    console.log("Got place", place)
  }

  const getDataFromAutoComplete = (data) => {
    console.log("got data:", data)
    if (data && data["place_id"]) {
      setPlaceId(data["place_id"])
    }
  }

  const handleOnChange = (inputRef) => {
    if (place) {
      setPlace(null)
      inputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    const data = {
      name: e.target.name.value,
      email,
      password,
      city_id: place.city_id,
    }
    const JSONdata = JSON.stringify(data)
    const endpoint = "api/signupApi"
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()

    if (result.isSuccess) {
      console.log("HELLO")
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      // window.location.href = "/"
    }

    console.log("response", result)
  }

  return (
    <div>
      <HeaderImage title="Sign up" />
      <div className="mx-auto mt-20 w-[500px] rounded-md border py-5 shadow-md">
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col p-2"
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="name"
            id="name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="email"
            id="email"
          />

          <label htmlFor="dates">Password</label>
          <input
            type="password"
            className="my-2 rounded-full border p-2 text-gray-400 outline-none"
            name="password"
            id="password"
          />

          <label>City</label>
          <LocationAutoComplete
            className="mt-2 rounded-full border p-2 text-gray-400 outline-none"
            onChange={handleOnChange}
            toggleFunction={handleSelect}
          />

          <button type="submit" className="btn mt-6">
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
