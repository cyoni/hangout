import { Pagination, TextField, Tooltip } from "@mui/material"
import React, { Fragment, useState } from "react"
import CircularButton from "../CircularButton"
import FeedPost from "../FeedPost/FeedPost"
import Spinner from "../Spinner"
import usePosts from "./usePosts"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
import Loader from "../Loader"
function CityPosts({ place }) {
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
  } = usePosts(place)

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between">
        <div className="text-2xl">Discussion</div>
      </div>
      <div className="mx-auto bg-gray-50 p-5 rounded-md shadow-md mt-4 px-36">
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
        <div className="flex mt-2 justify-end">
          <CircularButton onClick={() => sendPost()}>
            <SendRoundedIcon className="h-6" />
          </CircularButton>
        </div>

        {postsQuery.isLoading && (
          <div className="flex my-10">
            <Spinner className="mx-auto" />
          </div>
        )}

        {noContent ? (
          <div className="text-center text-3xl my-16 ">
            No discussions found
          </div>
        ) : (
          pages && (
            <div>
              <div className="relative">
                {postsQuery.isFetching && <Loader />}

                <div className="border-t mt-5 mb-10"></div>

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
                className="w-fit mx-auto my-5"
                count={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default CityPosts
