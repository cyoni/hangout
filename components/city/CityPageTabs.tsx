import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import CityPosts from "./CityPosts"
import Travels from "./Travels"
import { useRouter } from "next/router"
import { POST, TRAVEL } from "../../lib/consts/consts"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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

interface Props {
  place: Place
}
export default function CityPageTabs({ place }: Props) {
  const router = useRouter()
  const { query } = router
  const POSTS_CODE = 0
  const TRAVEL_CODE = 1
  const getView = () => {
    if (router.query.view === "posts") return POSTS_CODE
    else return TRAVEL_CODE
  }

  const [value, setValue] = React.useState(getView())

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="Posts"
            onClick={() =>
              router.push(`/city/${query.cityId}?view=posts`, undefined, {
                shallow: true,
              })
            }
          />
          <Tab
            label="Travelers"
            onClick={() =>
              router.push(`/city/${query.cityId}?view=travelers`, undefined, {
                shallow: true,
              })
            }
          />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <CityPosts place={place} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Travels place={place} />
      </TabPanel>
    </Box>
  )
}
