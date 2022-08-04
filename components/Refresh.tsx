import { RefreshIcon } from "@heroicons/react/outline"
import React from "react"

interface Props {
  className: string
  onClick: Function
}
function Refresh({ className, onClick }: Props) {
  return (
    <div>
      <RefreshIcon onClick={() => onClick()} className={className} />
    </div>
  )
}

export default Refresh
