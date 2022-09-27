import React from "react"
import RefreshIcon from "@mui/icons-material/Refresh"

interface Props {
  className: string
  onClick: Function
}
function Refresh({ className, onClick }: Props) {
  return <RefreshIcon onClick={() => onClick()} className={className} />
}

export default Refresh
