import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  GET_NOTIFICATION_METHOD,
} from "../../lib/consts"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts"
const jwt = require("jsonwebtoken")
import { dbAggregate, dbFind, dbUpdateOne } from "../../lib/mongoUtils"
import { getSharedToken } from "../../lib/chat"
import { resetUnreadMessages } from "../../lib/inboxUtils"

async function getUnreadMsgsCount({ userId }: { userId: string }) {
  try {
    if (!userId) return { error: "bad request" }

    console.log("getNotifications userId", userId)

    const request: AggregateReq = {
      collection: "users",
      params: [
        { $match: { userId } },
        {
          $project: {
            _id: 0,
            unreadMsgs: { $size: { $ifNull: ["$unreadMsgs", []] } },
          },
        },
      ],
    }
    const results = await dbAggregate(request)
    console.log("results getNotifications", results)
    if (Array.isArray(results)) {
      console.log("results", results)
      return results.length > 0 ? results[0] : results
    } else return { error: "no results" }
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

async function getPreviewMessages(userId: string) {
  /// get all shared tokens
  const allSharedTokens = await getAllSharedTokens(userId)
  if (allSharedTokens.length === 0) {
    return []
  }
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

async function getAllMessagesByUserId({ theirId, userId }) {
  if (!theirId) {
    return { error: "No id was provided" }
  }

  const sharedToken = await getSharedToken(theirId, userId)
  if (!sharedToken) {
    return { error: "Shared token is invalid" }
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

  // Reset unread messages
  resetUnreadMessages(userId)

  return results
}
type Response = {
  error?: string
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
      case "SEND_MESSAGE": {
        break
      }
      case GET_PREVIEW_MESSAGES_METHOD:
        result = await await getPreviewMessages(userId)
        break
      case GET_ALL_MESSAGES_BY_USER_METHOD:
        result = await getAllMessagesByUserId({ ...req.body, userId })
        break
      case GET_NOTIFICATION_METHOD:
        result = await getUnreadMsgsCount({ userId })
        break
    }
    if (!result || result.error) res.status(400).json({ error: result.message })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
