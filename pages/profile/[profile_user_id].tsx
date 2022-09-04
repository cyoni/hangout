import { getToken } from "next-auth/jwt"
import React, { useState } from "react"
import HeaderImage from "../../components/HeaderImage"
import { getProfile } from "../../lib/profileUtils"
import useEditProfile from "../../components/Profile/EditProfile/useEditProfile"
import EditProfile from "../../components/Profile/EditProfile/EditProfile"
import ProfileContent from "../../components/Profile/ProfileContent"
import usePlace from "../../components/usePlace"

interface Props {
  profile: Profile
  followServiceProps: any
}
export default function Profile({ profile }: Props) {
  console.log("Profile", profile)

  const editProfileParams = useEditProfile(profile)

  const { places, getPlaceFromObject } = usePlace([profile.cityId])
  const place = getPlaceFromObject(profile?.cityId)

  console.log("new places", places)

  const ProfileError = () => {
    return (
      <div className="w-[500px] mx-auto flex flex-col items-center">
        <div className="mt-10 text-3xl">This profile was not found</div>
        <button className="btn mt-10" onClick={() => router.push("/")}>
          Home
        </button>
      </div>
    )
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <HeaderImage headerExternalClass="h-96" title={null}>
        <button className="btn-outline  absolute right-10 border border-white px-4 py-1 font-bold text-gray-200 shadow-xl hover:border-blue-800">
          Edit wrap Image
        </button>
      </HeaderImage>
      {console.log("profile_user_ place:", place)}
      <EditProfile editProfileParams={editProfileParams} place={place} />

      <div className="mx-auto w-[80%]">
        {profile ? (
          <ProfileContent
            profile={profile}
            place={place}
            setOpenEditProfile={editProfileParams.setOpenEditProfile}
          />
        ) : (
          <ProfileError />
        )}
      </div>
    </>
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
