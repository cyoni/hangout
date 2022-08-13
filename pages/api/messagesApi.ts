import { SEND_MESSAGE_METHOD, USERS_COLLECTION } from "./../../lib/consts"
import {
  GET_ALL_MESSAGES_BY_USER_METHOD,
  GET_NOTIFICATION_METHOD,
} from "../../lib/consts"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { GET_PREVIEW_MESSAGES_METHOD } from "../../lib/consts"
import {
  dbAggregate,
  dbFind,
  dbInsertMany,
  dbUpdateOne,
} from "../../lib/mongoUtils"
import { getSharedToken } from "../../lib/chat"
import {
  getPreviewMsgs,
  getUnreadMsgsIds,
  resetUnreadMessages,
} from "../../lib/inboxUtils"
import randomString from "../../lib/randomString"
import { isNullOrEmpty } from "../../lib/scripts/strings"

async function receiverCheck(userId: string) {
  const result = await dbAggregate({
    collection: "users",
    params: [{ $match: { userId } }],
  })
  return result.length === 1 && result[0].userId === userId
}
async function createSharedToken(user1: string, user2: string) {
  const sharedToken = randomString(32)
  const result = await dbInsertMany("messages_token", [
    {
      sharedToken,
      user1,
      user2,
    },
  ])
  return result.insertedCount === 1 ? sharedToken : null
}
async function insertUnreadMsgToReceiver({ timestamp, receiverId, senderId }) {
  //FIX 
  const result = await dbUpdateOne(
    USERS_COLLECTION,
    { userId: receiverId },
    { $push: { 'unreadMsgs.$[elem]': { senderId: senderId, timestamp } } },
    { multi: false, arrayFilters: [{ "elem.userId": senderId }] }
  )
  console.log("result", result)
  // await dbUpdateOne(
  //   "users",
  //   { userId: receiverId },
  //   { $push: { unreadMsgs: { senderId: senderId, timestamp } } },
  //   {}
  // )
}

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
async function SendMessage({ senderId, receiverId, message }) {
  if (
    isNullOrEmpty(senderId) ||
    isNullOrEmpty(receiverId) ||
    isNullOrEmpty(message)
  )
    return { error: "bad request" }

  const checkUser = await receiverCheck(receiverId)
  if (!checkUser) {
    return { error: "receiver check failed" }
  }

  let sharedToken = await getSharedToken(senderId, receiverId)
  if (!sharedToken) sharedToken = await createSharedToken(senderId, receiverId)
  console.log("RESULT sharedToken", sharedToken)
  if (!sharedToken) return { error: "creation of shared token failed" }

  const timestamp = Date.now()

  const dataToDb = {
    sharedToken,
    senderId,
    receiverId,
    message,
    timestamp,
  }
  console.log("dataToDb", dataToDb)

  const data = [{ ...dataToDb }]

  await insertUnreadMsgToReceiver({ senderId, receiverId, timestamp })

  const sendMessageHandler = await dbInsertMany("messages", data)
  if (sendMessageHandler.acknowledged) {
    return { message: "message has been sent" }
  }
  return {
    error: `message could not be send. Error: ${sendMessageHandler.error}`,
  }
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
    return []
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

    console.log("request message", req.body)

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }
    switch (method) {
      case SEND_MESSAGE_METHOD: {
        result = await SendMessage({
          message: req.body.message,
          receiverId: req.body.theirId,
          senderId: userId,
        })
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
    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
