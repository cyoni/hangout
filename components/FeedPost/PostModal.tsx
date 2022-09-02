import { Avatar, TextField } from "@mui/material"
import React from "react"
import CircularButton from "../CircularButton"
import Spinner from "../Spinner"
import useComment from "./useComment"

function PostModal({ renderOptions, post }) {
  const { sendComment, commentMutation, message, setMessage, commentQuery } = useComment(
    post._id
  )

  console.log("commentQuery", commentQuery.data)

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="flex justify-between ml-2">
        <div className="flex space-x-2 mt-4">
          <Avatar className="h-24 w-24" />
          <div>
            <div className="text-3xl  mt-2 ">Yoni</div>
            <p className="text-sm leading-5	">Tel Aviv, Israel</p>
            <p className="text-sm leading-3	">2 hours ago</p>
          </div>
        </div>
        <div>{renderOptions()}</div>
      </div>

      <div className=" border rounded-md p-2 min-h-[150px] my-5">
        {post.message}
      </div>

      <div className="text-2xl">Discussion</div>

      <div className="  min-h-[150px]  mt-3">
        <TextField
          id="outlined-multiline-flexible"
          label="Join the conversation!"
          className="w-full bg-white"
          multiline
          minRows={2}
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex mt-2 justify-end">
          <button className="btn" onClick={sendComment}>
            Send
          </button>
        </div>

        <div className="border-t py-5 mt-5 space-y-5">
          <div className="font-semibold text-xl">10 Comments</div>

          <div className="flex space-x-2 items-center">
            <Avatar className="h-12 w-12 self-start" />
            <div className="">
              <p className="font-bold text-lg ">Yoni</p>
              <p>
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here{" "}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 items-center">
            <Avatar className="h-12 w-12 self-start" />
            <div className="">
              <p className="font-bold text-lg ">Yoni</p>
              <p>
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here{" "}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 items-center">
            <Avatar className="h-12 w-12 self-start" />
            <div className="">
              <p className="font-bold text-lg ">Yoni</p>
              <p>
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here{" "}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 items-center">
            <Avatar className="h-12 w-12 self-start" />
            <div className="">
              <p className="font-bold text-lg ">Yoni</p>
              <p>
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here
                Message here Message here Message here Message here Message here{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostModal
