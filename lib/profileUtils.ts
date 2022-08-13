import { USERS_COLLECTION } from "./consts"
import { dbAggregate } from "./mongoUtils"

export async function getProfile(userId) {
  try {
    const req: AggregateReq = {
      collection: USERS_COLLECTION,
      params: [
        { $match: { userId } },
        { $project: { name: 1, picture: 1, cityId: 1, userId: 1, aboutMe: 1 } },
      ],
    }
    const data = await dbAggregate(req)
    console.log("get profile", data)
    if (Array.isArray(data) && data.length > 0) {
      return { profile: data[0] }
    } else {
      throw Error(`could not find user ${userId}`)
    }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export async function updateProfile() {
  try {
  } catch (e) {}
}
