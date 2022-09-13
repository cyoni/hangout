import React from "react"
import { IconButton } from "@mui/material"

function IconButtonCustom({ children }) {
  return <IconButton className="z-10">{children}</IconButton>
}

export default IconButtonCustom
