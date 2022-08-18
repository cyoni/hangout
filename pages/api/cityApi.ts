import {
  CityPostsTable as CITY_POSTS_TABLE,
  GET_MESSAGES,
  POST_MESSAGE,
  ProfileParams,
  USERS_COLLECTION,
} from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"
import { dbAggregate, dbFind, dbInsertOne } from "../../lib/mongoUtils"
import { queryPlace } from "../../lib/place"

async function Post({ userId, message, cityId }) {
  const result = await dbInsertOne(CITY_POSTS_TABLE, {
    timestamp: Date.now(),
    userId,
    message,
    cityId,
  })
  if (!result.acknowledged) return { error: "Error updating city table" }

  return { message: "post uploaded successfully" }
}

async function GetPosts(cityId) {
  if (!cityId) return { error: "city id is invalid" }

  const request: AggregateReq = {
    collection: CITY_POSTS_TABLE,
    params: [
      {
        $lookup: {
          localField: "userId",
          foreignField: "userId",
          as: "profile",
          from: USERS_COLLECTION,
        },
      },
      { $match: { cityId } },
      {
        $project: {
          timestamp: 1,
          message: 1,
          userId: 1,
          profile: ProfileParams,
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ],
  }
  return await dbAggregate(request)
}

type Response = {
  error?: string
}

function badRequest(res, message) {
  return res.status(400).json(message)
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { method } = req.body || req.query
    const token = await getToken({ req })
    const { userId } = token
    let result = null

    if (!token || !userId) {
      throw new Error(`User not authenticated`)
    }

    console.log("request message", req.body)

    const { cityId } = req.body || req.query

    if (!Number(cityId)) return badRequest(res, "invalid city id")
    const convertedCityId = Number(cityId)
    const place: Place = await queryPlace(convertedCityId)
    if (!place) return badRequest(res, "invalid place")

    switch (method) {
      case POST_MESSAGE:
        result = await Post({
          message: req.body.message,
          userId,
          cityId: convertedCityId,
        })
        break
      case GET_MESSAGES:
        result = await GetPosts(convertedCityId)
        break
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
