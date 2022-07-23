import { getToken } from "next-auth/jwt"
const jwt = require("jsonwebtoken")
import { dbAggregate } from "../../lib/mongoUtils"

async function getNotifications({ userId }: { userId: string }) {
  try {
    console.log("getNotifications userId", userId)

    const request: AggregateReq = {
      collection: "messages",
      $match: { receiverId: userId },
      $count: "msgs",
    }

    const results = await dbAggregate(request)

    if (Array.isArray(results)) {
      console.log("results", results)
      return {
        isSuccess: true,
        message: "succeed",
        data: results.length > 0 ? results[0] : results,
      }
    }
  } catch (e) {
    throw Error(e.message)
  }
}

async function getMessages({ userId }: { userId: string }) {
  console.log("userIduserId", userId)

  const request: AggregateReq = {
    collection: "messages",
    $match: { receiverId: userId, senderId: userId },
    innerJoin: {
      from: "users",
      foreignField: "userId",
      as: "profile",
      localField: "senderId",
    },
    $project: { message: 1, timestamp: 1, profile: { place: 1, name: 1 } },
    $sort: { timestamp: -1 },
  }

  const results = await dbAggregate(request)
  console.log("results", results)
  return { isSuccess: true, message: "succeed", data: results }
}

export default async function handler(req, res) {
  try {
    const { method } = req.body
    const token = await getToken({ req })
    const { userId } = token
    let result = null

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }
    if (method === "getMessages") {
      result = await getMessages({ userId })
    } else if (method === "getNotifications") {
      result = await getNotifications({ userId })
    }

    if (result?.isSuccess) res.status(200).json(result)
    else res.status(200).json(result)
  } catch (e) {
    return { isSuccess: false, message: e.message }
  }
}
