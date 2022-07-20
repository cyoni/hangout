import { isUserVarified } from "../../lib/jwtUtils"
const jwt = require("jsonwebtoken")
import { dbAggregate } from "../../lib/mongoUtils"

async function getNotifications({ jwt, userId }) {
  try {
    console.log("userIduserId", userId)

    if (!isUserVarified(jwt)) {
      throw Error("auth failed")
    }

    const request: AggregateReq = {
      collection: "messages",
      $match: { receiverId: userId },
      $count: "msgs",
    }

    const results = await dbAggregate(request)
    console.log("results", results)
    return { isSuccess: true, message: "succeed", data: results }
  } catch (e) {
    return { isSuccess: false, message: e.message }
  }
}

async function getMessages({ jwt, userId }) {
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
    const { jwt, method } = req.body
    if (!isUserVarified(jwt)) {
      throw new Error("auth failed")
    }

    let result = null

    if (method === "getMessages") {
      result = await getMessages(req.body)
    } else if (method === "getNotifications") {
      result = await getNotifications(req.body)
    }

    if (result?.isSuccess) res.status(200).json(result)
    else res.status(200).json(result)
  } catch (e) {
    return { isSuccess: false, message: e.message }
  }
}
