import { signOut } from "next-auth/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { UPDATE_PROFILE_METHOD } from "../../../lib/consts/consts"
import { post } from "../../../lib/postman"
import { getFullPlaceName } from "../../../lib/consts/place"

interface Props {
  profile: Profile
  toggleOnFinishCallback?: Function
}
function useEditProfile({ profile, toggleOnFinishCallback }: Props) {
  const [name, setName] = useState<string>(profile?.name)
  const [placeId, setPlaceId] = useState<string>(profile?.placeId)
  const [aboutMe, setAboutMe] = useState<string>(profile?.aboutMe)
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] =
    useState<boolean>(false)

  const submitForm = async () => {
    const result = await post({
      url: "/api/profileApi",
      body: { method: UPDATE_PROFILE_METHOD, name, placeId, aboutMe },
    })
    if (!result.error) {
      setOpenEditProfile(false)
      toggleOnFinishCallback?.()
    } else toast.error("Update failed.")
  }

  const handleSelect = (place: Place) => {
    if (place && place.placeId) {
      setPlaceId(place.placeId)
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
    placeId,
    setPlaceId,
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
