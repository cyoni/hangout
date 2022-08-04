import clientPromise from "../../lib/mongodb"
import {
  dbAggregate,
  dbFind,
  dbInsertMany,
  dbUpdateOne,
} from "../../lib/mongoUtils"
import { getToken } from "next-auth/jwt"
import randomString from "../../lib/randomString"
import { getSharedToken } from "../../lib/chat"
import { Collection } from "mongodb"

interface Request {
  message: string
  senderId: string
  receiverId: string
}

async function receiverCheck(userId: string) {
  const result = await dbAggregate({
    collection: "users",
    params: [{ $match: { userId } }],
  })
  return result.length === 1 && result[0].userId === userId
}

async function createSharedToken(user1, user2) {
  const sharedToken = randomString(20)
  const result = await dbInsertMany("messages_token", [
    {
      sharedToken,
      user1,
      user2,
    },
  ])
  return result.insertedCount === 1 ? sharedToken : null
}
async function insertUnreadMsgToReceiver({
  timestamp,
  receiverId,
  senderId,
}) {
  await dbUpdateOne(
    "users",
    { userId: receiverId },
    { $push: { unreadMsgs: { senderId: senderId, timestamp } } },
    {}
  )
}
async function SendMessage(request: Request) {
  const { senderId, receiverId, message } = request
  const checkUser = await receiverCheck(request.receiverId)
  if (!checkUser) {
    return { error: "receiver check failed" }
  }

  let sharedToken = await getSharedToken(senderId, receiverId)
  if (!sharedToken) sharedToken = createSharedToken(senderId, receiverId)
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

  insertUnreadMsgToReceiver({ senderId, receiverId, timestamp })

  const sendMessageHandler = await dbInsertMany("messages", data)
  if (sendMessageHandler.acknowledged) {
    return { message: "message has been sent" }
  }
  return {
    error: `message could not be send. Error: ${sendMessageHandler.error}`,
  }
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req })
    if (!token) res.status(400)

    const request: Request = {
      message: req.body.message,
      senderId: token.userId,
      receiverId: req.body.theirId,
    }

    if (token && request.message && request.receiverId) {
      const result = await SendMessage(request)
      if (result.error) res.status(400).json(JSON.stringify(result.error))
      res.status(200).json(JSON.stringify(result))
    } else {
    }
  } catch (e) {
    res.status(500).json(JSON.stringify(e.message))
  }
}
