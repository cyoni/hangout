import React from "react"

interface Props {
  count: number
}
const Notification = ({ count }: Props) => {
  return (
    <div
      className="absolute top-[-5px]
        left-[15px] rounded-full bg-red-600 
        px-[7px] py-[1px] text-sm font-bold
      text-white opacity-95 shadow-md"
    >
      {count}
    </div>
  )
}

export default Notification
