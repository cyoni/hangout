import React from "react"

// put here avatar options
function Avatar({ className }) {
  return (
    <div>
      <img
        className={`mx-1 h-9 w-9 cursor-pointer
                 rounded-full shadow-xl transition
                 duration-100 hover:scale-110 ${className ? className : ""}`}
        src="https://cdn.pixabay.com/photo/2014/02/27/16/10/tree-276014__340.jpg"
        alt=""
      />
    </div>
  )
}

export default Avatar
