import React from "react"
import Spinner from "./Spinner"

interface Props {
  blur?: boolean
}
function Loader({ blur }: Props) {
  return (
    <div
      className={`absolute top-0 left-0 z-10 h-full w-full ${
        !blur ? "bg-gray-50 opacity-80" : ""
      }`}
      style={{ backdropFilter: blur ? "blur(10px)" : null }}
    >
      <Spinner
        className={`absolute top-0 left-0 bottom-0 right-0 m-auto h-fit w-fit `}
      />
    </div>
  )
}

export default Loader
