import React from "react"

function MenubarRow({ title, Icon }) {
  return (
    <div
      className="flex cursor-pointer items-center
     space-x-2 rounded-full px-2 py-2
      pl-5 text-xl font-light	 
       transition
      duration-300 hover:bg-gray-100
      hover:ease-out"
    >
      <Icon className="h-6" />
      <div>{title}</div>
    </div>
  )
}

export default MenubarRow
