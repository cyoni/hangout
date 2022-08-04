import Link from "next/link"
import React from "react"
import Notification from "./Notification"

interface Props {
  title: string
  Icon?: any
  link: string
  notifications?: number
  externalClass?: string
  onClick?: Function
}
function MenubarRow({
  title,
  Icon,
  link,
  externalClass,
  notifications,
  onClick,
}: Props) {
  console.log("linklink", link)
  return (
    <Link href={link}>
      <div
        onClick={() => (onClick ? onClick() : null)}
        className={`relative flex cursor-pointer
      items-center space-x-2
      rounded-full px-3 py-2
      text-xl hover:bg-gray-100 hover:shadow-sm
       ${externalClass}`}
      >
        {Icon && <Icon className="h-6" />}
        {notifications > 0 && <Notification count={notifications} />}
        <div>{title}</div>
      </div>
    </Link>
  )
}

export default MenubarRow
