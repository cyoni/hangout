import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Avatar from "../../components/Avatar"
import HeaderImage from "../../components/HeaderImage"
import LocationAutoComplete from "../../components/placesAc"
import { GET_PROFILE_METHOD } from "../../lib/consts"
import { post } from "../../lib/postman"
import { getProfile } from "../../lib/profileUtils"

export default function Profile({ profile }) {
  console.log("Profile", profile)

  const ProfileError = () => {
    return <div>Sorry, this profile was not found</div>
  }

  const ProfileContent = () => {
    return (
      <div>
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
    )
  }

  return (
    <div>
      <form action="">
        <HeaderImage title={`Profile`} />
        <div className="mx-auto mt-10 flex max-w-[600px] flex-col items-center">
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
    if (data.isSuccess) {
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
