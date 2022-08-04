import type { NextApiRequest, NextApiResponse } from "next"
import { dbAggregate } from "../../lib/mongoUtils"

type Response = {
  profiles?: Profile[]
  error?: string
}

async function getProfiles(users: string[]) {
  if (!Array.isArray(users)) return { error: "bad request." }
  const profiles: Profile[] = await dbAggregate({
    collection: "users",
    params: [
      { $match: { userId: { $in: users } } },
      { $project: { _id: 0, userId: 1, picture: 1, cityId: 1, name: 1 } },
    ],
  })
  return profiles
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { userIds } = req.body
    const profiles = await getProfiles(userIds)

    if (!profiles || profiles.error)
      res.status(400).json({ error: profiles.error })

    res.status(200).json({ profiles })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
