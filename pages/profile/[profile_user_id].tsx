import { getToken } from "next-auth/jwt"
import Router, { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Avatar from "../../components/Avatar"
import HeaderImage from "../../components/HeaderImage"
import ModalWrapper from "../../components/ModalWrapper"
import LocationAutoComplete from "../../components/LocationAutoComplete"
import Popup from "../../components/Popup"
import { GET_PROFILE_METHOD, UPDATE_PROFILE_METHOD } from "../../lib/consts"
import { post } from "../../lib/postman"
import { getProfile } from "../../lib/profileUtils"
import EditProfile from "../../components/EditProfile"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import TravelTimeLine from "../../components/TravelTimeLine"
import Itinerary from "../../components/Itinerary"
import ButtonIntegration from "../../components/ButtonIntegration"
import { TextField } from "@mui/material"
import AutoComplete from "../../components/AutoComplete"
import AlertDialog from "../../components/AlertDialog"
import { signOut } from "next-auth/react"
import { getFullPlaceName } from "../../lib/scripts/place"
import { sleep } from "../../lib/scripts/general"
import toast from "react-hot-toast"

interface Props {
  profile: Profile
}
export default function Profile({ profile }: Props) {
  console.log("Profile", profile)
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)
  const router = useRouter()

  const handleSendMessage = (e) => {
    e.preventDefault()
    router.push(`/messages/conversation/${profile.userId}`)
  }

  const ProfileError = () => {
    return <div>Sorry, this profile was not found</div>
  }

  ////////////////

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

  /////

  const ProfileContent = () => {
    return (
      <div>
        <div className="mt-5 flex space-x-3">
          <Avatar className="relative bottom-12 h-32 w-32  " />
          <div className="flex-1">
            <p className="text-3xl font-medium tracking-wide capitalize">
              {profile.name}
            </p>
            <p>{profile.cityId}</p>
          </div>
          <button
            className="btn self-start px-4"
            onClick={() => setOpenEditProfile(true)}
          >
            Edit Profile
          </button>
          <button
            className="btn self-start px-4"
            onClick={(e) => handleSendMessage(e)}
          >
            Send Message
          </button>
        </div>
        <div className="mx-auto w-[80%]">
          <div className=" ">
            <div className="pl-2 text-3xl ">About</div>
            <div
              className={`mt-2 min-h-[200px] rounded-md border p-2 ${
                isNullOrEmpty(profile.aboutMe)
                  ? "flex items-center justify-center"
                  : ""
              }`}
            >
              {profile.aboutMe ? (
                <p className="text-lg">{profile.aboutMe}</p>
              ) : (
                <p className="text-lg ">No about yet.</p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="pl-2 text-3xl ">Travels</div>

            <Itinerary />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form action="">
        <HeaderImage headerExternalClass="h-96" title={null}>
          <button className="btn-outline  absolute right-10 border border-white px-4 py-1 font-bold text-gray-200 shadow-xl hover:border-blue-800">
            Edit wrap Image
          </button>
        </HeaderImage>

        <ModalWrapper
          className="w-[60%]"
          isOpen={openEditProfile}
          onRequestClose={() => setOpenEditProfile(false)}
        >
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
                fetchFunction={null}
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
            <button
              className="btn-outline py-2 mt-5"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </form>
        </ModalWrapper>

        <div className="mx-auto w-[80%]">
          {profile ? <ProfileContent /> : <ProfileError />}
        </div>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const userId = context.params.profile_user_id
  const token = getToken(context)

  if (userId && token) {
    const data = await getProfile(userId)
    if (!data.error) {
      return {
        props: {
          profile: data.profile,
        },
      }
    }
  }

  return {
    props: {
      profile: null,
    },
  }
}
