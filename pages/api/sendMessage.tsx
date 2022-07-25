import clientPromise from "../../lib/mongodb"
import { dbAggregate, dbFind } from "../../lib/mongoUtils"
import { getToken } from "next-auth/jwt"

interface Request {
  senderId: string
  receiverId: string
  message: string
}

async function recieverCheck(userId: string) {
  const result = await dbAggregate({ collection: "users", $match: { userId } })
  return result.length === 1 && result[0].userId === userId
}

async function SendMessage(params: Request) {
  const client = await clientPromise
  const db = client.db()

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
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req })
    if (!token) res.status(400)
    const senderId = token.userId
    const body = req.body

    if (token && body.receiverId && body.message) {
      const result = await SendMessage({ ...body, senderId })
      if (result.isSuccess) res.status(200).json(JSON.stringify(result))
    } else throw Error("request invalid")
  } catch (e) {
    res.status(400).json(JSON.stringify(e.message))
  }
}
