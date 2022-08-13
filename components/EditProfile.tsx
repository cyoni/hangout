import { MailIcon } from "@heroicons/react/outline"
import {
  Alert,
  Autocomplete,
  Backdrop,
  Badge,
  CircularProgress,
  TextField,
} from "@mui/material"
import { signOut } from "next-auth/react"
import fetch from "node-fetch"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { UPDATE_PROFILE_METHOD } from "../lib/consts"
import { getCitiesAutoComplete } from "../lib/AutoCompleteUtils"
import { post } from "../lib/postman"
import { sleep } from "../lib/scripts/general"
import AlertDialog from "./AlertDialog"
import AutoComplete from "./AutoComplete"
import Avatar from "./Avatar"
import ButtonIntegration from "./ButtonIntegration"
import LocationAutoComplete from "./LocationAutoComplete"
import ModalWrapper from "./ModalWrapper"
import { getFullPlaceName } from "../lib/scripts/place"

interface Props {
  openEditProfile: boolean
  setOpenEditProfile: Function
  profile: Profile
}

function EditProfile({ openEditProfile, setOpenEditProfile, profile }: Props) {
  const [name, setName] = useState<string>(profile.name)
  const [cityId, setCityId] = useState<number>(profile.cityId)
  const [aboutMe, setAboutMe] = useState<string>(profile.aboutMe)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] =
    useState<boolean>(false)

  const submitForm = async () => {
    const result = await post({
      url: "/api/profileApi",
      body: { method: UPDATE_PROFILE_METHOD, name, cityId, aboutMe },
    })
    if (!result.error) {
      setOpenEditProfile(false)
      toast.success("Updated successfully!")
      await sleep(1000)
      window.location.reload()
    } else toast.error("Update failed.")
  }

  const handleSelect = (place: Place) => {
    if (place && place.city_id) {
      setCityId(place.city_id)
    }
  }

  const getOptionLabel = (option: Place) => {
    return getFullPlaceName(option)
  }

  const isOptionEqualToValue = (option: Place, value: Place) => {
    return option.city === value.city
  }

  const handleDeleteAccount = (e) => {
    e.preventDefault()
    setShowDeleteAccountDialog(true)
  }

  const handleDelete = () => {
    signOut()
  }

  return (
    <ModalWrapper isOpen={openEditProfile} onRequestClose={setOpenEditProfile}>
      {showDeleteAccountDialog && (
        <AlertDialog
          open={showDeleteAccountDialog}
          setOpen={setShowDeleteAccountDialog}
          dialogTitle={"Delete Account"}
          dialogText={"Are you sure you want to delete this account?"}
          cancelText={"Cancel"}
          okText={"Delete Account"}
          okFunction={handleDelete}
        />
      )}
      <form
        className="w-[40%] mx-auto flex justify-center items-center flex-col space-y-5"
        onSubmit={submitForm}
      >
        <div className="font-bold mt-5 text-xl">Edit Profile</div>
        <Avatar className="h-28 w-28 mt-5" />

        <div className="w-full mt-4">
          <AutoComplete
            label="City"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelect}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </div>

        <TextField
          className="mt-5 border outline-none rounded-md p-2"
          fullWidth
          id="outlined-basic"
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name"
          variant="outlined"
        />

        <TextField
          className="rounded-md h-[300px] outline-none p-2"
          id="outlined-multiline-static"
          label="About Me"
          multiline
          rows={12}
          value={aboutMe}
          fullWidth
          onChange={(e) => setAboutMe(e.target.value)}
        />

        <ButtonIntegration
          buttonText="Save"
          externalClass="mt-24"
          buttonClassName="px-10"
          onClick={submitForm}
        />

        <div className="border-b w-full mt-5 "></div>
        <button className="btn-outline py-2 mt-5" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </form>
    </ModalWrapper>
  )
}

export default EditProfile
