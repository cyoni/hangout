import { getToken } from "next-auth/jwt"
import Router, { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Avatar from "../../components/Avatar"
import HeaderImage from "../../components/HeaderImage"
import ModalWrapper from "../../components/ModalWrapper"
import LocationAutoComplete from "../../components/LocationAutoComplete"
import Popup from "../../components/Popup"
import { GET_PROFILE_METHOD } from "../../lib/consts"
import { post } from "../../lib/postman"
import { getProfile } from "../../lib/profileUtils"
import EditProfile from "../../components/EditProfile"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import TravelTimeLine from "../../components/TravelTimeLine"
import Itinerary from "../../components/Itinerary"

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

  const ProfileContent = () => {
    return (
      <div>
        {openEditProfile && (
          <EditProfile
            openEditProfile={openEditProfile}
            setOpenEditProfile={setOpenEditProfile}
            profile={profile}
          />
        )}
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

                <Itinerary/>
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
