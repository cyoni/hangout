import { Badge } from "@mui/material"
import Link from "next/link"
import React from "react"

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
  return (
    <Link href={link}>
      <div
        onClick={() => (onClick ? onClick() : null)}
        className={`${
          externalClass ? externalClass : ""
        } relative flex cursor-pointer items-center rounded-full py-2 px-4 text-xl transition-all duration-100 hover:bg-gray-100 hover:shadow-sm active:bg-gray-200
       `}
      >
        <div className="flex gap-2 items-center">
          {Icon && (
            <Badge badgeContent={notifications} color="error">
              <Icon className="h-6" />
            </Badge>
          )}

          <span className="w-full text-center">{title}</span>
        </div>
      </div>
    </Link>
  )
}

export default MenubarRow
