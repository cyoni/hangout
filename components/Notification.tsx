import { MailIcon } from "@heroicons/react/outline"
import { Badge } from "@mui/material"
import React from "react"

interface Props {
  count: number
}
const Notification = ({ count }: Props) => {
  if (count > 0)
    return (
      <Badge badgeContent={4} color="secondary">
  <MailIcon color="action" />
</Badge>
    
    )
  else return null
}

export default Notification
