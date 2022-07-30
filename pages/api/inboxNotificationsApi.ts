import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  GET_NOTIFICATION_METHOD,
} from "./../../lib/consts"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts"
const jwt = require("jsonwebtoken")
import { dbAggregate, dbFind } from "../../lib/mongoUtils"

async function getNotifications({ userId }: { userId: string }) {
  try {
    console.log("getNotifications userId", userId)

    const request: AggregateReq = {
      collection: "messages",
      params: [{ $match: { receiverId: userId } }, { $count: "msgs" }],
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

async function getAllSharedTokens(userId: string) {
  const result = await dbFind("messages_token", {
    $or: [{ user1: userId }, { user2: userId }],
  })
  return result.length > 0 ? result.map((item) => item.sharedToken) : []
}

async function getPreviewMessages(userId: string[], allSharedTokens: string[]) {
  const convertedSharedTokens = allSharedTokens.map((token) => {
    return { sharedToken: token }
  })
  const result = await dbAggregate({
    collection: "messages",
    params: [
      { $match: { $or: [...convertedSharedTokens] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { sharedToken: "$sharedToken" },
          sharedToken: { $first: "$sharedToken" },
          receiverId: { $first: "$receiverId" },
          senderId: { $first: "$senderId" },
          timestamp: { $first: "$timestamp" },
          message: { $first: "$message" },
          theirId: {
            $first: {
              $cond: {
                if: { $eq: ["$receiverId", userId] },
                then: "$senderId",
                else: "$receiverId",
              },
            },
          },
        },
      },
      {
        $project: {
          theirId: 1,
          sharedToken: 1,
          senderId: 1,
          receiverId: 1,
          message: 1,
          timestamp: 1,
          profile: { picture: 1, name: 1, cityId: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "userId",
          localField: "theirId",
          as: "profile",
        },
      },
    ],
  })
  console.log("getLatestMessages", result)

  return result
}

async function getMessages({ userId }: { userId: string }) {
  console.log("userIduserId", userId)

  /// get all tokens
  const allSharedTokens = await getAllSharedTokens(userId)
  if (allSharedTokens.length === 0) {
    return { message: "no messages available" }
  }

  /// query all messages by token
  const previewMessages = await getPreviewMessages(userId, allSharedTokens)

  console.log("results getMessages", JSON.stringify(previewMessages))
  return previewMessages
}

async function getAllMessagesByUser({ sharedToken }) {
  if (!sharedToken) {
    return { error: "No shared token was provided" }
  }
  const results = await dbAggregate({
    collection: "messages",
    params: [
      { $match: { sharedToken } },
      { $sort: { timestamp: 1 } },
      {
        $project: {
          sharedToken: 1,
          receiverId: 1,
          senderId: 1,
          message: 1,
          timestamp: 1,
        },
      },
    ],
  })

  console.log("results getAllMessagesByUser", JSON.stringify(results))
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
    switch (method) {
      case GET_PREVIEW_MESSAGES_METHOD:
        result = await getMessages({ userId })
        break
      case GET_ALL_MESSAGES_BY_USER_METHOD:
        result = await getAllMessagesByUser(req.body)
        break
      case GET_NOTIFICATION_METHOD:
        result = await getNotifications({ userId })
        break
    }
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(403).json({ error: e.message })
  }
}
