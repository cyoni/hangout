import { Avatar, TextField } from "@mui/material"
import React from "react"
import toast from "react-hot-toast"
import ButtonIntegration from "../ButtonIntegration"
import CircularButton from "../CircularButton"
import Spinner from "../Spinner"
import Comment from "./Comment"
import useComment from "./useComment"

function PostModal({ renderOptions, post }) {
  const { sendComment, commentMutation, message, setMessage, commentQuery } =
    useComment(post._id)

  console.log("commentQuery", commentQuery.data)
  const { data: comments } = commentQuery

  React.useEffect(() => {
    if (commentMutation.isSuccess) {
      toast.success("You comment was successfully posted!")
    }
    if (commentMutation.error) {
      toast.error(
        "You comment was not posted. Please try again later. msg: " +
          commentMutation.error
      )
    }
  }, [commentMutation.error, commentMutation.isSuccess])

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
          <ButtonIntegration
            buttonClassName="btn"
            onClick={sendComment}
            callback={commentQuery.refetch}
          >
            Send
          </ButtonIntegration>
        </div>
        {console.log("comments", comments)}
        <div className="border-t py-5 mt-5 space-y-5">
          <div className="font-semibold text-xl">
            {comments?.length} Comments
          </div>

          { <div className="mx-auto"><Spinner  /> </div>}

          {commentQuery.isSuccess &&
            comments.map((comment: IComment) => (
              <div key={comment._id}>
                {console.log("comment", comment)}
                <Comment {...comment} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PostModal
