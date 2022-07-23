import { PlaceAutocompleteType } from "@googlemaps/google-maps-services-js"
import React, { useEffect } from "react"
import Avatar from "../components/Avatar"
import HeaderImage from "../components/HeaderImage"
import LocationAutoComplete from "../components/placesAc"

function Profile() {
  useEffect(() => {

    
  }, [])

  return (
    <div>
      <form action="">
        <HeaderImage title="Profile" />
        <div className="mx-auto mt-10 flex max-w-[600px] flex-col items-center">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32" />
            <div className="mt-2 text-3xl font-medium tracking-wide">Yoni</div>
          </div>

          <div className="mt-5 flex w-80 flex-col">
            <label>City</label>
            <LocationAutoComplete className="mt-2 rounded-full border px-2 py-1 outline-none" />

            <label className="mt-2">Picture</label>
            <input className="mt-2 rounded-full border px-2 py-1 outline-none" />

            <label className="mt-2">About me</label>
            <textarea className="mt-2 h-36 rounded-xl border px-2 py-1 outline-none"></textarea>
          </div>

          <div>
            <button className="btn mt-10 px-10">Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Profile
