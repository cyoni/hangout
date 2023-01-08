import React from "react"
import RefreshIcon from "@mui/icons-material/Refresh"

interface Props {
  className: string
  onClick: Function
}
function Refresh({ className, onClick }: Props) {
  return <RefreshIcon onClick={() => onClick()} className={className} sx={{height: "40px", width: "40px"}} />
}

export default Refresh
