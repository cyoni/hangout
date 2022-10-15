import { GET_FOLLOWING } from "./consts"
import {  get } from "./postman"
export const POST_COMMENTS_KEY = "post-comments"

export const FollowingQuery = async (userId: string) => {
  console.log("FollowingQuery1111111")
  return await get("http://localhost:3000/api/followApi", { method: GET_FOLLOWING, userId })
}
