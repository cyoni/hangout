import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React from "react"
import { getFullPlaceName } from "../../lib/scripts/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import Avatar from "../Avatar"
import Itinerary from "../Itinerary"
import { isAuthenticated, isAuthor } from "../../lib/session"
import ButtonIntegration from "../ButtonIntegration"
import useFollow from "../useFollow"
import HeaderImage from "../HeaderImage"

interface Props {
  profile: Profile
  place: Place
  setOpenEditProfile: Function
}

const ProfileContent = ({ profile, place, setOpenEditProfile }: Props) => {
  const session = useSession()
  const { follow } = useFollow()

  console.log("session: ", session)
  const router = useRouter()
  console.log("profile content place", place)
  const handleSendMessage = (e) => {
    e.preventDefault()
    router.push(`/messages/conversation/${profile.userId}`)
  }

  return (
    <div>
      <div className="mt-5 flex space-x-3">
        <Avatar className="relative bottom-12 h-32 w-32  " />
        <div className="flex-1">
          <p className="text-3xl font-medium tracking-wide capitalize">
            {profile.name}
          </p>
          <p>{getFullPlaceName(place)}</p>
        </div>

        {isAuthor(session, profile.userId) && (
          <button
            className="btn self-start px-4"
            onClick={() => setOpenEditProfile(true)}
          >
            Edit Profile
          </button>
        )}

        <button
          className="btn self-start px-4"
          onClick={(e) => handleSendMessage(e)}
        >
          Send Message
        </button>
        <ButtonIntegration
          onClick={() => follow({ userId: "123" })}
          onFinishText={<>Following</>}
        >
          Follow me
        </ButtonIntegration>
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

export default ProfileContent
