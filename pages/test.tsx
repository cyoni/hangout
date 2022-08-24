import * as React from "react"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import ContentCut from "@mui/icons-material/ContentCut"
import ContentCopy from "@mui/icons-material/ContentCopy"
import ContentPaste from "@mui/icons-material/ContentPaste"
import Cloud from "@mui/icons-material/Cloud"
import { getPlace } from "../lib/dbClient"
import { my_following_list } from "../lib/consts/query"
import { QueryCache, useQuery } from "@tanstack/react-query"

export default function Test() {
  const [result, setResult] = React.useState<string>()


  const x = useQuery(['my-following-list'], { enabled: false})
  // const queryCache = new QueryCache({
  //   onError: (error) => {
  //     console.log(error)
  //   },
  //   onSuccess: (data) => {
  //     console.log(data)
  //   },
  // })
  // const ans = queryCache.find(['my-following-list'])
  console.log("ansansans", x.data)

  return <div>{JSON.stringify(x.data)}</div>
}
