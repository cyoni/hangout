import Link from "next/link"
import { Props } from "next/script"
import React from "react"

interface Props {
  title: string
  Icon?: any
  link: string
  externalClass?: string
}
function MenubarRow({ title, Icon, link, externalClass }: Props) {
  return (
    <a href={link}>
      <div
        className={`flex cursor-pointer
      items-center space-x-2
      rounded-full px-3 py-2
      text-xl hover:bg-gray-100 hover:shadow-sm
       ${externalClass}`}
      >
        {Icon && <Icon className="h-6" />}
        <div>{title}</div>
      </div>
    </a>
  )
}

export default MenubarRow
