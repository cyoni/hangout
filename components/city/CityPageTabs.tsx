import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import CityPosts from "./CityPosts"
import useItinerary from "../useItinerary"
import Travels from "./Travels"
import { useRouter } from "next/router"
import { POST, TRAVEL } from "../../lib/consts"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  const router = useRouter()
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
  const POSTS_CODE = 0
  const TRAVEL_CODE = 1
  const getView = () => {
    if (router.query.view === POST) {
      return POSTS_CODE
    } else if (router.query.view === TRAVEL) {
      return TRAVEL_CODE
    } else {
      return TRAVEL_CODE
    }
  }

  const [value, setValue] = React.useState(getView())

  const changeTab = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    }
  }

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
          <Tab label="Posts" {...changeTab(0)} />
          <Tab label="Travelers" {...changeTab(1)} />
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
