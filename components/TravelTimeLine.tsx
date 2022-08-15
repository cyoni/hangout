import * as React from "react"

export default function TravelTimeLine() {
  const Separator = () => {
    return <div className="h-11 ml-1 w-[3px] rounded-lg bg-slate-500"></div>
  }
  const Dot = () => {
    return <span className="text-sm">○</span>
  }
  return (
    <div className="p-2 basis-[30%]">
    
      <div className="flex space-x-3 items-center">
        <Dot />
        <div className="ml-4 font-bold">Tel Aviv, Israel</div>
        <div>10/05/22 - 15/05/22</div>
      </div>
      <Separator />
      <div className="flex space-x-3 items-center">
        <Dot />
        <div className="ml-4 font-bold">Tel Aviv, Israel</div>
        <div>10/05/22 - 15/05/22</div>
      </div>

      <Separator />
      <div className="flex space-x-3 items-center">
        <Dot />
        <div className="ml-4 font-bold">Tel Aviv, Israel</div>
        <div>10/05/22 - 15/05/22</div>
      </div>
    </div>
  )
}
