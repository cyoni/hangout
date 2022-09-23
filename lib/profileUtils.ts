import { FOLLOW_TABLE } from "./consts/tables"
import { ProfileParams, USERS_COLLECTION } from "./consts"
import { dbAggregate } from "./mongoUtils"
import { getFollowing } from "../pages/api/followApi"
import { Following } from "../pages/typings/typings"

export async function getProfile(userId, includeFollowing = false) {
  const req: AggregateReq = {
    collection: USERS_COLLECTION,
    params: [
      { $match: { userId } },
      { $project: { ...ProfileParams, aboutMe: 1 } },
    ],
  }
  const profile = (await dbAggregate(req))[0]

  if (profile) {
    let following: Following[] = []
    if (!includeFollowing) following = (await getFollowing(userId)) || null
    const result = { profile, following }
    return result
  } else {
    return { error: "User not found" }
  }
}

export async function updateProfile() {
  try {
  } catch (e) {}
}
