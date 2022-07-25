import { NextApiRequest, NextApiResponse } from "next"
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
      return results.length > 0 ? results[0] : results
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
      localField: "senderId",
      as: "userProfile",
    },
    $project: {
      senderId: 1,
      message: 1,
      timestamp: 1,
      userProfile: { profile: 1 },
    },
    $sort: { timestamp: -1 },
  }
  const results: MessageObj[] = await dbAggregate(request)
  console.log("results results", JSON.stringify(results))
  for (let i = 0; i < results.length; i++) {
    const curr = results[i]
    curr.userProfile = curr.userProfile[0].profile
  }
  console.log("MessageObj results", results)
  return results
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { method } = req.body
    const token = await getToken({ req })
    const { userId } = token
    let result = null

    console.log("msg inbox token", token)

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }
    if (method === "getMessages") {
      result = await getMessages({ userId })
    } else if (method === "getNotifications") {
      result = await getNotifications({ userId })
    }
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(403).json({ error: e.message })
  }
}