import { getToken } from "next-auth/jwt"
import { NextApiRequest, NextApiResponse } from "next"
import { START_FOLLOW } from "../../lib/consts"
import { dbAggregate, dbFind, dbUpdateOne } from "../../lib/mongoUtils"
import { FOLLOW_TABLE } from "../../lib/consts/tables"

type Response = {
  error?: string
}

export async function follow(body, me: string) {
  const { userId } = body

  // check if the requester already follows
  const filter = {
    $or: [
      { $and: [{ user1: me }, { user2: userId }] },
      { $and: [{ user1: userId }, { user2: me }] },
    ],
  }

  let newMethod = 1
  const response = await dbAggregate({
    collection: FOLLOW_TABLE,
    params: [{ $match: filter }],
  })

  if (response && response.user2 === me) {
    newMethod = 2
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    let result = null
    const { method } = req.body
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
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
