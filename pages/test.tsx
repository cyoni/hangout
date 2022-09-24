import ImageKit from "imagekit"
import * as React from "react"
import { getImageKit } from "../lib/ImageKit"
import { sha256 } from "js-sha256"

import Box from "@mui/material/Box"
import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialIcon from "@mui/material/SpeedDialIcon"
import SpeedDialAction from "@mui/material/SpeedDialAction"
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined"
import SaveIcon from "@mui/icons-material/Save"
import PrintIcon from "@mui/icons-material/Print"
import ShareIcon from "@mui/icons-material/Share"

export default function Test() {
  const actions = [
    { icon: <FileCopyIcon />, name: "Copy" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ]

  return (
    <div>

    </div>
  )
}
