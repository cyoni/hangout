import { Pagination, TextField, Tooltip } from "@mui/material"
import React, { Fragment, useState } from "react"
import CircularButton from "../Buttons/CircularButton"
import FeedPost from "../FeedPost/FeedPost"
import Spinner from "../Loaders/Spinner"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
import Loader from "../Loaders/Loader"
import usePosts from "./usePosts"
function CityPosts({ place }) {
  console.log("nvweuvnoweuvn", place)
  const {
    sendPost,
    postsQuery,
    messageInput,
    setMessageInput,
    noContent,
    pages,
    page,
    setPage,
    totalPages,
  } = usePosts({ placeId: place?.placeId })

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  return (
    <div className="mx-auto w-[60%]">
      <div className="text-2xl">Discussion</div>

      <div className="mt-4 flex min-h-[700px] flex-col rounded-md bg-gray-50 p-5 px-36 shadow-md">
        <TextField
          id="outlined-multiline-flexible"
          label="Write your post here"
          className="w-full bg-white"
          multiline
          minRows={2}
          maxRows={4}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <div className="mt-2 ml-auto block">
          <CircularButton onClick={() => sendPost()}>
            <SendRoundedIcon className="h-6" />
          </CircularButton>
        </div>

        {postsQuery.isLoading ? (
          <div className="my-10 flex">
            <Spinner className="mx-auto" />
          </div>
        ) : noContent ? (
          <div className="my-16 text-center text-3xl ">
            No discussions found
          </div>
        ) : null}

        {pages && (
          <>
            <div className="relative mb-5">
              {postsQuery.isFetching ? (
                <Loader />
              ) : (
                <div className="mt-5 mb-10 border-t"></div>
              )}
              {pages.map((post, index) => {
                return (
                  <Fragment key={index}>
                    <div key={post._id}>
                      <FeedPost post={post} />
                    </div>
                  </Fragment>
                )
              })}
            </div>
            <Pagination
              className="mx-auto my-5 mt-auto w-fit "
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CityPosts
