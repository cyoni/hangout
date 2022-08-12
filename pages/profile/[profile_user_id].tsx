import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Avatar from "../../components/Avatar"
import HeaderImage from "../../components/HeaderImage"
import LocationAutoComplete from "../../components/placesAc"
import Popup from "../../components/Popup"
import { GET_PROFILE_METHOD } from "../../lib/consts"
import { post } from "../../lib/postman"
import { getProfile } from "../../lib/profileUtils"
import Modal from "react-modal"


export default function Profile({ profile }) {
  console.log("Profile", profile)
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)




  const ProfileError = () => {
    return <div>Sorry, this profile was not found</div>
  }

  const ProfileContent = () => {
    return (
      <div>
        { <Modal
        style={{
          overlay: {
            background: "transparent",
            backdropFilter: "blur(3px)",
          },
        }}
        isOpen={openEditProfile}
        onRequestClose={()=> setOpenEditProfile(false)}
        contentLabel="My dialog"
      >
        <div>My modal dialog.</div>
        <button onClick={()=> setOpenEditProfile(false)}>Close modal</button>
      </Modal>}
        <div className="mt-5 flex space-x-3">
          <Avatar className="relative bottom-12 h-32 w-32  " />
          <div className="flex-1">
            <p className="text-3xl font-medium tracking-wide ">Yoni</p>
            <p>Tel Aviv, Israel</p>
          </div>
          <button className="btn self-start px-4" onClick={()=> setOpenEditProfile(true)}>Edit Profile</button>
          <button className="btn self-start px-4">Send Message</button>
        </div>
        <div className="mx-auto w-[80%]">
          <div className=" ">
            <div className="pl-2 text-3xl ">About</div>
            <div className="mt-2 min-h-[200px] rounded-md border p-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit magni
              quasi corrupti maiores quod. Eius sequi itaque animi assumenda,
              magni obcaecati qui, id minima iusto commodi odio provident, at
              quasi.
            </div>
          </div>

          <div className="mt-3">
            <div className="pl-2 text-3xl ">Travels</div>
            <div className="mt-2 min-h-[200px] rounded-md border p-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit magni
              quasi corrupti maiores quod. Eius sequi itaque animi assumenda,
              magni obcaecati qui, id minima iusto commodi odio provident, at
              quasi.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form action="">
        <HeaderImage headerExternalClass="h-[300px]" title={null}>
          <button className="btn-outline absolute right-10 border border-white px-4 py-1 font-bold text-gray-200 shadow-xl hover:border-blue-800">
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
