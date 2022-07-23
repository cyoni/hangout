import React from "react"

// put here avatar options
interface Props {
  className?: string
}
function Avatar({ className } : Props) {
  return (
    <div>
      <img
        className={`mx-1 cursor-pointer
                 rounded-full shadow-xl transition
                 duration-100 hover:scale-110 ${className ? className : ""}`}
        src="https://cdn.pixabay.com/photo/2014/02/27/16/10/tree-276014__340.jpg"
        alt=""
      />
    </div>
  )
}

export default Avatar
