import { USERS_COLLECTION } from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import { dbAggregate, dbUpdateOne } from "../../lib/mongoUtils"

type Response = {
  profiles?: Profile[] | boolean
  error?: string
}

async function getProfiles({ userIds }) {
  if (!Array.isArray(userIds)) return { error: "bad request." }
  const profiles: Profile[] = await dbAggregate({
    collection: "users",
    params: [
      { $match: { userId: { $in: userIds } } },
      { $project: { _id: 0, userId: 1, picture: 1, cityId: 1, name: 1 } },
    ],
  })
  return profiles
}

async function saveProfile({ userId, name, place, aboutMe }) {
  const result = await dbUpdateOne(
    USERS_COLLECTION,
    { userId },
    { $set: { name, aboutMe } },
    {}
  )
  console.log("update profile result", result)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { method } = req.body
    const token = await getToken({ req })
    if (!token) return { error: "true", message: "Invalid token" }

    let result = null

    switch (method) {
      case "SAVE_PROFILE":
        result = await saveProfile({ userId: token.userId, ...req.body })
        break
      case "GET_PROFILES":
        result = await getProfiles(req.body)
    }

    if (result.error) res.status(400).json({ error: profiles.message })

    res.status(200).json({ profiles })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
