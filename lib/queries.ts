import { GET_FOLLOWING } from "./consts"
import { get } from "./postman"

export const FollowingQuery = async (userId = null) => {
    console.log("FollowingQuery", userId)
  return await get("/api/followApi", `method=${GET_FOLLOWING}`)
}
