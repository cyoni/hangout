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
