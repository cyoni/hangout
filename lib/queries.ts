import { GET_FOLLOWING } from "./consts"
import { get, newGet } from "./postman"

export const FollowingQuery = async (userId: string) => {
  console.log("FollowingQuery1111111")
  return await newGet("/api/followApi", { method: GET_FOLLOWING, userId })
}
