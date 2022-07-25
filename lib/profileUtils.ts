import { dbAggregate } from "./mongoUtils"

export async function getProfile(userId) {
  try {
    const req: AggregateReq = {
      collection: "users",
      $match: { userId },
    }
    const data = await dbAggregate(req)
    console.log("getprofile", data)
    if (Array.isArray(data) && data.length > 0) {
      return { isSuccess: true, profile: data[0] }
    } else {
      throw Error(`could not find user ${userId}`)
    }
  } catch (e) {
    return { isError: true, message: e.message }
  }
}

export async function updateProfile() {
  try {
  } catch (e) {}
}
