import React, { useEffect, useRef } from "react"
import HeaderImage from "../../components/Header/HeaderImage"
import { getProfile } from "../../lib/ApiUtils/profileApiUtils"
import useEditProfile from "../../components/Profile/EditProfile/useEditProfile"
import EditProfile from "../../components/Profile/EditProfile/EditProfile"
import ProfileContent from "../../components/Profile/ProfileContent"
import usePlace from "../../components/Hooks/usePlace"
import useManageImages from "../../components/Hooks/useManageImages"
import { convertToBase64 } from "../../lib/scripts/images"
import { UPLOAD_WRAPPER_IMAGE } from "../../lib/consts/consts"
import ProfileError from "../../components/Profile/ProfileError"
import Loader from "../../components/Loaders/Loader"
import { Menu, MenuItem } from "@mui/material"
import toast from "react-hot-toast"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"
import { checkUser } from "../../lib/scripts/session"

interface Props {
  profile: Profile
  following: Following
  session: Session
  followServiceProps: any
}
export default function Profile({ profile, following, session }: Props) {
  console.log("Profile", profile)
  const toggleOnFinishCallback = () => {
    window.location.reload()
    toast.success("Updated successfully!")
  }
  const editProfileParams = useEditProfile({ profile, toggleOnFinishCallback })
  const { getPlaceFromObject } = usePlace([profile?.placeId])
  const place = getPlaceFromObject(profile?.placeId)
  const pickImage = () => inputFile.current.click()
  const { triggerImage, imageMutation } = useManageImages()
  const inputFile = useRef(null)
  const handleImage = (e) => {
    const update = async () => {
      const base64 = await convertToBase64(e)
      triggerImage({ base64, method: UPLOAD_WRAPPER_IMAGE })
    }
    update()
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (profile.wrapPicture) setAnchorEl(event.currentTarget)
    else pickImage()
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (imageMutation.isSuccess) {
      toast.loading("Refreshing window...")
      window.location.reload()
    }
  }, [imageMutation.isSuccess])

  return (
    <>
      <HeaderImage
        headerExternalClass="h-96"
        customImageId={profile?.wrapPicture}
      >
        <div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                pickImage()
                handleClose()
              }}
            >
              Upload Cover
            </MenuItem>
            <MenuItem
              onClick={() => {
                triggerImage({ method: "REMOVE_WRAPPER_IMAGE" })
                handleClose()
              }}
            >
              Remove Cover
            </MenuItem>
          </Menu>
        </div>

        <button
          className="
          btn-outline absolute right-10 border border-white bg-sky-200 bg-opacity-20 px-4 py-1 font-bold text-gray-50 shadow-2xl hover:border-sky-600 "
          onClick={handleClick}
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
            following={following}
            place={place}
            session={session}
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
  const session = await getSession(context)
  const checkUserRes = checkUser(context, session)
  if (checkUserRes.redirect) return checkUserRes

  const userId = context.params.profile_user_id

  if (userId) {
    const data = await getProfile(userId)
    if (!data.error) {
      return {
        props: { profile: data.value.profile, following: data.value.following },
      }
    }
  }

  return {
    props: { profile: null },
  }
}
