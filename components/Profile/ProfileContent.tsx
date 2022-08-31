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
import { FOLLOW } from "../../lib/consts"
import { Box, Tab, Tabs } from "@mui/material"

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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    }
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
          buttonClassName="btn"
          onClick={() =>
            follow({ userId: profile.userId, type: FOLLOW, name: profile.name })
          }
          onFinishText={<>Following</>}
        >
          Follow me
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
            <Tab label="Itinerary" />
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
          <div>
            <div className="pl-2 text-3xl ">Travels</div>
            <Itinerary />
          </div>
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
    </div>
  )
}

export default ProfileContent
