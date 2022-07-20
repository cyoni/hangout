import clientPromise from "../../lib/mongodb"
import { isUserVarified } from "../../lib/jwtUtils"
import { dbAggregate, dbFind } from "../../lib/mongoUtils"

interface Request {
  jwt: string
  senderId: string
  receiverId: string
  message: string
}

async function recieverCheck(userId: string) {
  const result = await dbAggregate({ collection: "users", $match: { userId } })
  return result.length === 1 && result[0].userId === userId
}

async function SendMessage(params: Request) {
  try {
    const client = await clientPromise
    const db = client.db()

    // varify user
    const userAuth = isUserVarified(params.jwt)
    console.log("userAuth", userAuth.isSuccess)

    if (!userAuth?.isSuccess) {
      throw new Error("auth error")
    }

    const checkUser = await recieverCheck(params.receiverId)
    if (!checkUser) {
      throw new Error("reciever check failed")
    }
    const dataToDb = {
      senderId: params.senderId,
      receiverId: params.receiverId,
      message: params.message,
      timestamp: Date,
    }
    console.log("dataToDb", dataToDb)

    const data = [{ ...dataToDb }]
    await db.collection("messages").insertMany(JSON.parse(JSON.stringify(data)))
    return { isSuccess: true, message: "message has been sent" }
  } catch (error) {
    return { isSuccess: false, message: error.message }
  }
}

export default async function handler(req, res) {
  const body = req.body
  const result = await SendMessage(req.body)
  if (result) res.status(200).json(JSON.stringify(result))
  else res.status(400)
}
