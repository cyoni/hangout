import { Box, CircularProgress } from "@mui/material"
import React from "react"

interface Props {
  className?: string
}
function Spinner({ className }: Props) {
  return (
    <div className={className}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  )
}

export default Spinner
