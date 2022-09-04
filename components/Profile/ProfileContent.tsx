import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { getFullPlaceName } from "../../lib/scripts/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import Itinerary from "../Itinerary"
import { isAuthenticated, isAuthor } from "../../lib/session"
import ButtonIntegration from "../ButtonIntegration"
import useFollow from "../useFollow"
import { FOLLOW } from "../../lib/consts"
import { Avatar, Box, Fab, Tab, Tabs } from "@mui/material"
import ChatModal from "../ChatModal"
import EditIcon from "@mui/icons-material/Edit"
import CustomAvatar from "../CustomAvatar"
import useItinerary from "../useItinerary"
import usePlace from "../usePlace"

interface Props {
  profile: Profile
  place: Place
  setOpenEditProfile: Function
}

const ProfileContent = ({ profile, place, setOpenEditProfile }: Props) => {
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)
  const session = useSession()
  const { follow, unFollow, isFollowing } = useFollow()
  const { userItineraryQuery } = useItinerary({
    userIds: [profile.userId],
    isUser: true,
  })

  console.log("userItineraryQuery.data", userItineraryQuery.data)

  const { getFirstPlace, getPlaceFromObject, placeQuery } = usePlace(
    userItineraryQuery.data &&
      userItineraryQuery.data.map((travel) =>
        travel.itineraries.map((itin) => itin.place.city_id)
      )
  )

  const { name, userId, picture } = profile

  console.log("session: ", session)
  const router = useRouter()
  console.log("profile content place", place)

  const handleSendMessage = (e) => {
    e.preventDefault()
    setIsModalMessageOpen(true)
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    )
  }

  return (
    <div>
      <div className="mt-5 flex space-x-3">
        <div className="relative">
          <CustomAvatar
            name={name}
            userId={userId}
            picture={picture}
            className="relative bottom-12 h-36 w-36  "
          />

          <Fab
            color="primary"
            className="bg-blue-500 absolute top-14 h-10 w-10 right-0 z-[1]"
            aria-label="edit"
          >
            <EditIcon />
          </Fab>
        </div>

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
          buttonClassName="btn"
          onClick={() =>
            isFollowing(userId)
              ? unFollow({
                  userId: profile.userId,
                  type: FOLLOW,
                  name: profile.name,
                })
              : follow({
                  userId: profile.userId,
                  type: FOLLOW,
                  name: profile.name,
                })
          }
        >
          {isFollowing(userId) ? "Following" : "Follow"}
        </ButtonIntegration>
      </div>
      <div className="mx-auto w-[80%]">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "background.paper",
            marginBottom: "10px",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            <Tab label="About" />
            <Tab label="Travels" />
            <Tab label="Pictures" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <div>
            <div className="pl-2 text-3xl ">About</div>
            <div
              className={`mt-2 min-h-[400px] rounded-md border p-2 ${
                isNullOrEmpty(profile.aboutMe)
                  ? "flex justify-center items-center"
                  : ""
              }`}
            >
              {profile.aboutMe ? (
                <p className="text-lg">{profile.aboutMe}</p>
              ) : (
                <p className="text-2xl">No about yet.</p>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div className="pl-2 text-3xl">Travels</div>

          {userItineraryQuery.data && placeQuery.data && (
            <>
              {userItineraryQuery.data.map((userItinerary) => {
                {
                  console.log("userItinerary", userItinerary)
                }
                return (
                  <div key={userItinerary._id}>
                    <Itinerary
                      {...userItinerary}
                      getPlaceFromObject={getPlaceFromObject}
                    />
                  </div>
                )
              })}
            </>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div>
            <div className="pl-2 text-3xl ">Pictures</div>
            <div className="mt-2 min-h-[400px] rounded-md border p-2 flex items-center justify-center text-2xl">
              Coming Soon!
            </div>
          </div>
        </TabPanel>
      </div>

      <ChatModal
        name={name}
        userId={userId}
        isModalMessageOpen={isModalMessageOpen}
        setIsModalMessageOpen={setIsModalMessageOpen}
      />
    </div>
  )
}

export default ProfileContent
