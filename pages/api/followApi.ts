import { STOP_FOLLOW } from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import { NextApiRequest, NextApiResponse } from "next"
import { GET_FOLLOWING, START_FOLLOW } from "../../lib/consts"
import {
  dbAggregate,
  dbDeleteOne,
  dbFind,
  dbUpdateOne,
} from "../../lib/mongoUtils"
import { FOLLOW_TABLE } from "../../lib/consts/tables"
import { convertArrayToDictionary } from "../../lib/scripts/arrays"
import { queryPlace } from "../../lib/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"

type Response = {
  error?: string
}

const X_FOLLOWS_Y = 1
const XY_FOLLOW_EACH_OTHER = 2
async function follow(body, me: string) {
  const { userId } = body

  // check if the requester already follows
  const filter = {
    $or: [
      { $and: [{ user1: me }, { user2: userId }] },
      { $and: [{ user1: userId }, { user2: me }] },
    ],
  }

  let newMethod = X_FOLLOWS_Y
  const response = await dbAggregate({
    collection: FOLLOW_TABLE,
    params: [{ $match: filter }],
  })

  if (response && response.user2 === me) {
    newMethod = XY_FOLLOW_EACH_OTHER
  }

  const r = await dbUpdateOne(
    FOLLOW_TABLE,
    filter,
    { $set: { user1: me, user2: userId, method: newMethod } },
    { upsert: true }
  )

  console.log("r", r)
  return { result: "OK" }
}

async function unFollow(body, me: string) {
  const { userId } = body

  const data = await dbFind(FOLLOW_TABLE, {
    $or: [{ user1: userId }, { user2: userId }],
    $and: [
      { $or: [{ method: X_FOLLOWS_Y }, { method: XY_FOLLOW_EACH_OTHER }] },
    ],
  })

  const filter = {
    $or: [
      { $and: [{ user1: me }, { user2: userId }] },
      { $and: [{ user1: userId }, { user2: me }] },
    ],
  }

  if (data.length === 1) {
    const result = data[0]
    if (result.method == X_FOLLOWS_Y) {
      // DELETE
      const removeDocument = await dbDeleteOne(FOLLOW_TABLE, filter)
      console.log("removeDocument", removeDocument)
    } else {
      const r = await dbUpdateOne(
        FOLLOW_TABLE,
        filter,
        { $set: { user1: userId, user2: me, method: X_FOLLOWS_Y } },
        {}
      )
    }
  }
  return { message: "success" }
}

export async function getFollowing(userId) {
  console.log("getFollowing userId", userId)
  const data = await dbFind(FOLLOW_TABLE, {
    $or: [{ user1: userId }, { user2: userId }],
    $and: [
      { $or: [{ method: X_FOLLOWS_Y }, { method: XY_FOLLOW_EACH_OTHER }] },
    ],
  })

  console.log("getFollowing", data)

  const result = data.map((item) =>
    item.user1 === userId ? item.user2 : item.user1
  )

  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    let result = null
    const { method } = req.body || req.query
    const token = await getToken({ req })
    const { userId } = token

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }

    console.log("request message", req.body)

    // Controller
    switch (method) {
      case START_FOLLOW:
        result = await follow(req.body, userId)
        break
      case STOP_FOLLOW:
        result = await unFollow(req.body, userId)
        break
      case GET_FOLLOWING: {
        result = await getFollowing(req.query.userId ?? userId)
        break
      }
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
