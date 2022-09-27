import { signOut } from "next-auth/react"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { UPDATE_PROFILE_METHOD } from "../../../lib/consts"
import { post } from "../../../lib/postman"
import { sleep } from "../../../lib/scripts/general"
import { getFullPlaceName } from "../../../lib/scripts/place"

interface Props {
  profile: Profile
  toggleOnFinishCallback?: Function
}
function useEditProfile({ profile, toggleOnFinishCallback }: Props) {
  const [name, setName] = useState<string>(profile?.name)
  const [cityId, setCityId] = useState<number>(profile?.cityId)
  const [aboutMe, setAboutMe] = useState<string>(profile?.aboutMe)
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] =
    useState<boolean>(false)

  const submitForm = async () => {
    const result = await post({
      url: "/api/profileApi",
      body: { method: UPDATE_PROFILE_METHOD, name, cityId, aboutMe },
    })
    if (!result.error) {
      setOpenEditProfile(false)
      toggleOnFinishCallback?.()
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

  return {
    name,
    setName,
    cityId,
    setCityId,
    aboutMe,
    setAboutMe,
    showDeleteAccountDialog,
    setShowDeleteAccountDialog,
    submitForm,
    handleSelect,
    getOptionLabel,
    isOptionEqualToValue,
    handleDeleteAccount,
    handleDelete,
    openEditProfile,
    setOpenEditProfile,
  }
}

export default useEditProfile
