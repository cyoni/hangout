import {
  GET_PROFILES_METHOD,
  UPDATE_PROFILE_METHOD,
  USERS_COLLECTION,
} from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import { dbAggregate, dbUpdateOne } from "../../lib/mongoUtils"
import { isNullOrEmpty } from "../../lib/scripts/strings"

type Response = {
  result?: Profile[]
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

async function saveProfile({ userId, name, cityId, aboutMe }) {
  const fieldsToUpdate = {}

  if (!isNullOrEmpty(name)) fieldsToUpdate["name"] = name
  if (!isNullOrEmpty(aboutMe)) fieldsToUpdate["aboutMe"] = aboutMe
  if (!isNullOrEmpty(cityId)) fieldsToUpdate["cityId"] = cityId

  const result = await dbUpdateOne(
    USERS_COLLECTION,
    { userId },
    { $set: { ...fieldsToUpdate } },
    {}
  )
  console.log("update profile result", result)
  if (result.acknowledged) {
    return { message: "update success" }
  } else {
    return { error: "update failure" }
  }
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
      case UPDATE_PROFILE_METHOD:
        result = await saveProfile({ userId: token.userId, ...req.body })
        break
      case GET_PROFILES_METHOD:
        result = await getProfiles(req.body)
        console.log("get profiles ", result)
        break
      default:
        return res.status(400).json({ error: "no method was provided" })
    }

    if (result?.error) res.status(400).json({ error: result.message })

    res.status(200).json({ result })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
