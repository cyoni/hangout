import { getToken } from "next-auth/jwt"
import { dbAggregate } from "../../lib/mongoUtils"
async function getProfile(userId): Promise<ResponseObject> {
  const req: AggregateReq = {
    collection: "users",
    $match: { userId },
  }
  const data = await dbAggregate(req)

  if (Array.isArray(data) && data.length > 0) {
    return { isSuccess: true, data: data[0] }
  } else {
    throw Error(`could not find user ${userId}`)
  }
}

async function updateProfile(): Promise<ResponseObject> {
  try {
  } catch (e) {}
}

export default async function handler(req, res) {
  try {
    const { method } = req.query
    const { body } = req
    const { userId } = body

    if (!userId) throw Error("userId not valid")
    const token = await getToken({ req })
    if (!token) throw Error("auth failed")

    let result: ResponseObject = null

    switch (method) {
      case "getProfile":
        result = await getProfile(userId)
        break
      case "updateProfile":
        result = await updateProfile(body)
        break
    }
    res.status(200).json(result)
  } catch (e) {
    res.status(400).json({ isSuccess: false, message: e.message })
  }
}
