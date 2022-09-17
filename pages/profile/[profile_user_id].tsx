import { getToken } from "next-auth/jwt"
import React, { useEffect, useRef, useState } from "react"
import HeaderImage from "../../components/HeaderImage"
import { getProfile } from "../../lib/profileUtils"
import useEditProfile from "../../components/Profile/EditProfile/useEditProfile"
import EditProfile from "../../components/Profile/EditProfile/EditProfile"
import ProfileContent from "../../components/Profile/ProfileContent"
import usePlace from "../../components/usePlace"
import useManageImages from "../../components/useManageImages"
import { convertToBase64 } from "../../lib/scripts/images"
import { UPLOAD_WRAPPER_IMAGE } from "../../lib/consts"
import ProfileError from "../../components/Profile/ProfileError"
import Loader from "../../components/Loader"

interface Props {
  profile: Profile
  followServiceProps: any
}
export default function Profile({ profile }: Props) {
  console.log("Profile", profile)
  const editProfileParams = useEditProfile(profile)
  const { places, getPlaceFromObject } = usePlace([profile?.cityId])
  const place = getPlaceFromObject(profile?.cityId)
  console.log("new places", places)

  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const { imageMetadata, triggerImage, imageMutation } = useManageImages()
  const inputFile = useRef(null)
  const handleImage = (e) => {
    const update = async () => {
      const base64 = await convertToBase64(e)
      triggerImage({ base64, method: UPLOAD_WRAPPER_IMAGE })
    }
    update()
  }

  useEffect(() => {
    if (imageMutation.isSuccess) {
      window.location.reload()
    }
  }, [imageMutation.isSuccess])

  return (
    <>
      <HeaderImage
        headerExternalClass="h-96"
        customImageId={profile?.wrapPicture}
      >
        <button
          className="
          btn-outline absolute right-10 border
        border-white px-4 py-1 font-bold
        text-gray-200 shadow-2xl hover:border-sky-700 "
          onClick={() => inputFile.current.click()}
        >
          Change Cover
        </button>
      </HeaderImage>

      <EditProfile editProfileParams={editProfileParams} place={place} />

      <input
        type="file"
        name="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={(e) => handleImage(e)}
        ref={inputFile}
        style={{ display: "none" }}
      />

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
      {imageMutation.isLoading && <Loader blur />}
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
