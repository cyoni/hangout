import { GET_FOLLOWING } from "./consts"
import { get, newGet } from "./postman"

export const FollowingQuery = async (userId = null) => {
  console.log("FollowingQuery", userId)
  return await newGet("/api/followApi", { method: GET_FOLLOWING , userId: userId })
}
