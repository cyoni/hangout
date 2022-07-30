import clientPromise from "../../lib/mongodb"
import { dbAggregate, dbFind, dbInsert } from "../../lib/mongoUtils"
import { getToken } from "next-auth/jwt"
import randomString from "../../lib/randomString"

interface Request {
  senderId: string
  receiverId: string
  sharedToken?: any
  message: string
}

async function recieverCheck(userId: string) {
  const result = await dbAggregate({
    collection: "users",
    params: [{ $match: { userId } }],
  })
  return result.length === 1 && result[0].userId === userId
}

async function getSharedToken(senderId, receiverId) {
  const result = await dbFind("messages_token", {
    $or: [
      { $and: [{ user1: senderId }, { user2: receiverId }] },
      { $and: [{ user1: receiverId }, { user2: senderId }] },
    ],
  })
  return result.length > 0 ? result[0].sharedToken : null
}

async function createSharedToken(user1, user2) {
  const sharedToken = randomString(20)
  const result = await dbInsert("messages_token", [
    {
      sharedToken,
      user1,
      user2,
    },
  ])
  return result.insertedCount === 1 ? sharedToken : null
}
async function SendMessage(params: Request) {
  const { senderId } = params
  let sharedToken = params.sharedToken
  let receiverId = params.receiverId

  //const checkUser = await recieverCheck(receiverId)
  //if (!checkUser) {
  //  throw new Error("reciever check failed")
  //}

  if (sharedToken) {
    const varifyToken = await dbFind("messages_token", {
      sharedToken: sharedToken,
    })
    if (varifyToken && varifyToken.length > 0) {
      receiverId =
        varifyToken[0].user1 === senderId
          ? varifyToken[0].user2
          : varifyToken[0].user1
    } else {
      return { error: "invalid shared token" }
    }
  } else {
    // get shared token
    sharedToken = await getSharedToken(senderId, receiverId)
    console.log("msg result", sharedToken)
    if (!sharedToken) {
      // create unique token
      sharedToken = await createSharedToken(senderId, receiverId)
    }
  }

  console.log("RESULT sharedToken", sharedToken)

  const dataToDb = {
    sharedToken,
    senderId: params.senderId,
    receiverId: receiverId,
    message: params.message,
    timestamp: Date.now(),
  }
  console.log("dataToDb", dataToDb)

  const data = [{ ...dataToDb }]
  const sendMessageHandler = await dbInsert("messages", data)

  if (sendMessageHandler.insertedCount === 1) {
    return { isSuccess: true, message: "message has been sent" }
  }
  return {
    isSuccess: false,
    message: `message could not be send. Error: ${sendMessageHandler.error}`,
  }
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req })
    if (!token) res.status(400)
    const senderId = token.userId
    const body = req.body

    if (token && body.message) {
      const result = await SendMessage({ ...body, senderId })
      if (result.isSuccess) res.status(200).json(JSON.stringify(result))
    } else throw Error("request invalid")
  } catch (e) {
    res.status(400).json(JSON.stringify(e.message))
  }
}
