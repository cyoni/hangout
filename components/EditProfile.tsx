import { MailIcon } from "@heroicons/react/outline"
import { Alert, Backdrop, Badge, CircularProgress } from "@mui/material"
import fetch from "node-fetch"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { post } from "../lib/postman"
import Avatar from "./Avatar"
import ButtonIntegration from "./ButtonIntegration"
import LocationAutoComplete from "./LocationAutoComplete"
import ModalWrapper from "./ModalWrapper"

interface Props {
  openEditProfile: boolean
  setOpenEditProfile: Function
}

function EditProfile({ openEditProfile, setOpenEditProfile }: Props) {
  const [name, setName] = useState<string>(null)
  const [cityId, setCityId] = useState<number>(null)
  const [aboutMe, setAboutMe] = useState<string>(null)

  const submitForm = async (e) => {
    e.preventDefault()

    // await post({ url: "/api/profileApi", body: { name, cityId, aboutMe } })
    const refreshToast = toast.loading("Publishing hangout...")
    toast.success("Publish successfully!", { id: refreshToast })
  }

  const handleSelect = (place: Place, inputRef) => {
    if (place && place.city_id) {
      setCityId(place.city_id)
    }
  }

  const doSomehting = async () => {
    console.log("waiting")
    await post({ url: "https://ynet.com", body: {} })
    console.log("finished")
  }
  return (
    <ModalWrapper isOpen={openEditProfile} onRequestClose={setOpenEditProfile}>
      <form
        className="w-[40%] mx-auto flex justify-center items-center flex-col"
        onSubmit={submitForm}
      >
        <div className="font-bold mt-5 text-xl">Edit Profile</div>
        <Avatar className="h-28 w-28 mt-5" />

        <div className="w-full mt-4">
          <label htmlFor="" className="mt-5">
            City
          </label>
          <LocationAutoComplete
            className="border outline-none rounded-md p-2 w-full "
            toggleFunction={handleSelect}
          />
        </div>

        <div className="w-full mt-2">
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border outline-none rounded-md p-2 w-full "
          />
        </div>

        <div className="w-full mt-2">
          <label>About me</label>

          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="border rounded-md w-full h-[300px] outline-none p-2"
          />
        </div>

        <ButtonIntegration
          buttonText="Save"
          externalClass="mt-5"
          buttonClassName="px-10"
          onClick={() => doSomehting()}
        />

        <div className="border-b w-full mt-10"></div>
        <button className="btn-outline py-2 mt-5">Delete Account</button>
      </form>
    </ModalWrapper>
  )
}

export default EditProfile
