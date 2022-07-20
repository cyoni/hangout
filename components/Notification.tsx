import React from "react"

interface Props {
  count: number
}
const Notification = ({ count }: Props) => {
  if (count > 0)
    return (
      <div
        className="absolute top-[-6px]
        left-[15px] rounded-full bg-red-600 
        px-[7px] py-[1px] text-sm font-bold
      text-white opacity-95 shadow-md"
      >
        {count > 99 ? `99+` : count}
      </div>
    )
  else return null
}

export default Notification
