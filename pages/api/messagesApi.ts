import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  GET_NOTIFICATION_METHOD,
} from "../../lib/consts"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts"
import { dbAggregate, dbFind, dbUpdateOne } from "../../lib/mongoUtils"
import { getSharedToken } from "../../lib/chat"
import {
  getPreviewMsgs,
  getUnreadMsgsIds,
  resetUnreadMessages,
} from "../../lib/inboxUtils"

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

async function getAllSharedTokens(userId: string): Promise<string[]> {
  const result: string[] = []
  const tokens = await dbFind("messages_token", {
    $or: [{ user1: userId }, { user2: userId }],
  })
  if (tokens.length > 0) tokens.map((item) => result.push(item.sharedToken))
  return result
}

async function getPreviewMessages(userId: string) {
  /// get all shared tokens
  const allSharedTokens = await getAllSharedTokens(userId)
  if (allSharedTokens.length === 0) {
    return []
  }

  // get all unread msgs ids
  const unreadMsgsIds = await getUnreadMsgsIds(userId)
  console.log("unreadMsgsIds", unreadMsgsIds)
  // get all preview messages
  const previewMsgs = await getPreviewMsgs(userId, allSharedTokens)
  console.log("getLatestMessages", previewMsgs)

  return { unreadMsgsIds, previewMsgs }
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
