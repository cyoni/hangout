import { useSession } from "next-auth/react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { getFullPlaceName } from "../../lib/consts/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import Itinerary from "../City/Itinerary"
import { isAuthor } from "../../lib/session"
import ButtonIntegration from "../Buttons/ButtonIntegration"
import useFollow from "../Hooks/useFollow"
import { FOLLOW, REMOVE_IMAGE, UPLOAD_IMAGE } from "../../lib/consts"
import { Avatar, AvatarGroup, Box, Fab, Tab, Tabs } from "@mui/material"
import ChatModal from "../Modal/ChatModal"
import EditIcon from "@mui/icons-material/Edit"
import CustomAvatar from "../Avatar/CustomAvatar"
import useItinerary from "../Hooks/useItinerary"
import usePlace from "../Hooks/usePlace"
import { unique } from "../../lib/scripts/arrays"
import { convertToBase64 } from "../../lib/scripts/images"
import useManageImages from "../Hooks/useManageImages"
import Loader from "../Loaders/Loader"
import { Following, Member, Place, Profile } from "../../pages/typings/typings"
import Head from "next/head"

import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialIcon from "@mui/material/SpeedDialIcon"
import SpeedDialAction from "@mui/material/SpeedDialAction"
import CameraAlt from "@mui/icons-material/CameraAlt"
import Delete from "@mui/icons-material/Delete"

interface Props {
  profile: Profile
  place: Place
  setOpenEditProfile: Function
  following: Following
}

const ProfileContent = ({
  profile,
  following,
  place,
  setOpenEditProfile,
}: Props) => {
  const [isModalMessageOpen, setIsModalMessageOpen] = useState<boolean>(false)
  const [placeIds, setplaceIds] = useState<number[]>([])
  const session = useSession()
  const { follow, unFollow, isFollowing } = useFollow()
  const { triggerImage, imageMutation } = useManageImages()
  const { isLoading: isUploadingImage, isSuccess: isUploadingCompleted } =
    imageMutation
  const { getPlaceFromObject, placeQuery } = usePlace(placeIds)
  const inputFile = useRef(null)
  const actions = [
    {
      icon: <CameraAlt />,
      name: "Upload Picture",
      color: "#9900cc",
      onClick: () => inputFile.current.click(),
    },
    {
      icon: <Delete />,
      name: "Remove Picture",
      onClick: () => triggerImage({ method: "REMOVE_IMAGE" }),
    },
  ]
  const { userItineraryQuery } = useItinerary({
    userIds: [profile.userId],
    isUser: true,
  })

  useEffect(() => {
    if (userItineraryQuery.data) {
      const newData = []
      userItineraryQuery.data?.activeTravels?.forEach((travel) => {
        travel.itineraries.forEach((itin) => {
          newData.push(itin?.place?.placeId)
        })
      })
      userItineraryQuery.data?.inactiveTravels?.forEach((travel) => {
        travel.itineraries.forEach((itin) => {
          newData.push(itin?.place?.placeId)
        })
      })

      following.members.forEach((member) => {
        newData.push(member.profile[0].placeId)
      })

      setplaceIds(unique(newData))
    }
  }, [userItineraryQuery.data])

  useEffect(() => {
    if (isUploadingCompleted) {
      window.location.reload()
    }
  }, [isUploadingCompleted])

  const setCities = new Set<number>()
  console.log("setCities", setCities)

  const { name, userId, picture } = profile

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

  const renderTravelsCard = (data) => {
    if (data && placeQuery.data) {
      return (
        <>
          {data?.map((userItinerary) => {
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
      )
    }
  }

  const handleImage = (e) => {
    const update = async () => {
      const base64 = await convertToBase64(e)
      triggerImage({ base64, method: UPLOAD_IMAGE })
    }
    update()
  }

  const renderFollowing = () => {
    return following.members.map((item, i) => {
      if (i > 5) return
      const profile: Profile = item.profile[0]
      return (
        <CustomAvatar
          key={item._id}
          name={profile.name}
          userId={item.userId}
          picture={profile.picture}
        />
      )
    })
  }
  const menuButtonStyle =
    "transition-all duration-500 btn bg-white text-blue-500 ring-2 hover:bg-gray-100 hover:ring-4"

  return (
    <>
      <Head>
        <title>{name} - profile</title>
      </Head>
      {isUploadingImage && <Loader blur allScreenOverlay />}
      <div className="mt-5 flex space-x-3 ">
        <div className="relative">
          <CustomAvatar
            name={name}
            userId={userId}
            picture={picture}
            overrideLetterIfNoPicture
            disabled
            className="relative bottom-12 h-36 w-36  ring-4"
          />

          {picture ? (
            <SpeedDial
              className="absolute bottom-8 right-0 z-[1] "
              FabProps={{
                size: "medium",
                style: { backgroundColor: "rgb(59 130 246 )" },
              }}
              ariaLabel="fab for profile picture"
              icon={<EditIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  onClick={action.onClick}
                  tooltipTitle={action.name}
                />
              ))}
            </SpeedDial>
          ) : (
            <Fab
              color="primary"
              className="absolute top-14 right-0 z-[1] h-10 w-10 bg-blue-500"
              aria-label="edit"
              onClick={() => inputFile.current.click()}
            >
              <EditIcon />
            </Fab>
          )}
        </div>

        <input
          type="file"
          name="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={(e) => handleImage(e)}
          ref={inputFile}
          style={{ display: "none" }}
        />

        <div className="flex-1">
          <p className="text-3xl font-medium capitalize tracking-wide">
            {profile.name}
          </p>
          <p>{getFullPlaceName(place)}</p>
        </div>

        {isAuthor(session, profile.userId) && (
          <button
            className={`self-start px-4 ${menuButtonStyle}`}
            onClick={() => setOpenEditProfile(true)}
          >
            Edit Profile
          </button>
        )}

        <button
          className={`self-start px-4 ${menuButtonStyle}`}
          onClick={(e) => handleSendMessage(e)}
        >
          Send Message
        </button>
        <ButtonIntegration
          buttonClassName={menuButtonStyle}
          circularProgressColor="#80b3ff"
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
      <div className="min-h-[500px]">
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
            <Tab label="Following" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <>
            <div className="pl-2 text-3xl ">About</div>
            <div
              className={`mt-2 min-h-[300px] rounded-md border p-2 ${
                isNullOrEmpty(profile.aboutMe)
                  ? "flex items-center justify-center"
                  : ""
              }`}
            >
              {profile.aboutMe ? (
                <p className="text-lg">{profile.aboutMe}</p>
              ) : (
                <p className="text-2xl">No about yet.</p>
              )}
            </div>
            {following?.members.length > 0 && (
              <div className="pl-2">
                <div className="mt-4  text-3xl">Following</div>

                <div className="mt-3 h-[150px] rounded-md border">
                  <div className="flex justify-start">
                    <AvatarGroup
                      total={Math.min(following?.members.length, 5)}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 80,
                          height: 80,
                        },
                      }}
                    >
                      {renderFollowing()}
                    </AvatarGroup>
                  </div>
                  <button
                    className="btn-outline ml-auto block"
                    onClick={() => handleChange(null, 2)}
                  >
                    More
                  </button>
                </div>
              </div>
            )}
          </>
        </TabPanel>

        <TabPanel value={value} index={1}>
          {console.log("placeQuery.data ", placeQuery.data)}

          <div className="pl-2">
            <div className="mb-5 text-3xl">Upcoming trips</div>
            {userItineraryQuery.data?.activeTravels ? (
              <>{renderTravelsCard(userItineraryQuery.data.activeTravels)}</>
            ) : (
              <div>
                <p>No upcoming trips yet.</p>
              </div>
            )}

            <div className="mb-5 mt-6 text-3xl">Past trips</div>
            {userItineraryQuery.data?.inactiveTravels ? (
              <>{renderTravelsCard(userItineraryQuery.data.inactiveTravels)}</>
            ) : (
              <div>
                <p>No past trips yet.</p>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="pl-2">
            <div className="text-3xl">Following</div>
            <div className="mt-10 flex flex-wrap">
              {following?.members?.length === 0 && (
                <div className="text-xl">
                  {name} is not following anyone yet
                </div>
              )}
              {following?.members?.map((member: Member) => {
                const profile: Profile = member.profile[0]
                return (
                  <div
                    key={member._id}
                    className="flex max-w-[300px] flex-col items-center rounded-md border p-5 hover:ring-2"
                  >
                    <CustomAvatar
                      name={profile.name}
                      picture={profile.picture}
                      userId={member.userId}
                      className="h-36 w-36"
                    />
                    <p className="mt-2 text-lg font-bold capitalize">
                      {profile.name}
                    </p>
                    <p className="text-sm leading-3">
                      {getFullPlaceName(getPlaceFromObject(profile.placeId))}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </TabPanel>
      </div>

      <ChatModal
        profile={profile}
        isModalMessageOpen={isModalMessageOpen}
        setIsModalMessageOpen={setIsModalMessageOpen}
      />
    </>
  )
}

export default ProfileContent
